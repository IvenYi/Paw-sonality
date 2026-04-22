import { supabase } from './supabase';
import { getDeviceFingerprint } from '../utils/fingerprint';

export interface VerifyResult {
  success: boolean;
  message: string;
}

/**
 * 核心核销逻辑 (客户端使用)
 * @param code 用户输入的口令
 * @param petType 宠物类型 dog/cat
 * @param baseMbti 基础4轴MBTI
 */
export const verifyRedemptionCode = async (code: string, petType?: string, baseMbti?: string): Promise<VerifyResult> => {
  try {
    const formattedCode = code.trim().toUpperCase();
    if (!formattedCode) return { success: false, message: '请输入口令' };

    // 1. 获取设备指纹
    const deviceId = await getDeviceFingerprint();

    // 2. 查询口令状态
    const { data, error } = await supabase
      .from('redemption_codes')
      .select('*')
      .eq('code', formattedCode)
      .single();

    if (error || !data) {
      return { success: false, message: '口令无效或不存在' };
    }

    // 3. 判断是否全新
    if (!data.is_used) {
      const updateData: any = {
        is_used: true,
        device_id: deviceId,
        used_at: new Date().toISOString(),
      };
      if (petType) updateData.pet_type = petType;
      if (baseMbti) updateData.base_mbti = baseMbti;

      // 首次核销：绑定当前设备
      const { error: updateError } = await supabase
        .from('redemption_codes')
        .update(updateData)
        .eq('id', data.id);

      if (updateError) {
        console.error('Update error:', updateError);
        return { success: false, message: '核销失败，请稍后重试' };
      }
      return { success: true, message: '核销成功' };
    } 

    // 4. 已被使用：判断设备指纹是否一致
    if (data.is_used && data.device_id === deviceId) {
      return { success: true, message: '欢迎回来' }; // 原设备恢复解锁状态
    }

    // 设备指纹不匹配，说明该码已被别人使用
    return { success: false, message: '该口令已被其他设备使用' };

  } catch (err) {
    console.error('Verification exception:', err);
    return { success: false, message: '网络异常，请重试' };
  }
};

/**
 * 追记 5 轴结果 (客户端深度测试完成后使用)
 */
export const updateFinalResult = async (code: string, finalMbti: string, ownerMbti: string) => {
  try {
    const formattedCode = code.trim().toUpperCase();
    await supabase
      .from('redemption_codes')
      .update({
        final_mbti: finalMbti,
        owner_mbti: ownerMbti
      })
      .eq('code', formattedCode);
  } catch (err) {
    console.error('Failed to update final result:', err);
  }
};

/**
 * 批量生成口令 (管理员使用)
 */
export const generateCodes = async (count: number = 50, batchId: string = 'batch_1') => {
  const codes = [];
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 去除容易混淆的 I,O,1,0
  
  for (let i = 0; i < count; i++) {
    let code = '';
    for (let j = 0; j < 6; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    codes.push({
      code,
      batch_id: batchId,
      is_used: false
    });
  }

  const { data, error } = await supabase
    .from('redemption_codes')
    .insert(codes)
    .select();

  if (error) {
    console.error('Failed to generate codes:', error);
    return { success: false, data: [] };
  }

  return { success: true, data };
};

// ==========================================
// Admin Dashboard 专用数据接口
// ==========================================

export const getDashboardStats = async () => {
  const { count: totalCount } = await supabase
    .from('redemption_codes')
    .select('*', { count: 'exact', head: true });

  const { count: usedCount } = await supabase
    .from('redemption_codes')
    .select('*', { count: 'exact', head: true })
    .eq('is_used', true);

  const today = new Date();
  today.setHours(0,0,0,0);
  const { count: todayCount } = await supabase
    .from('redemption_codes')
    .select('*', { count: 'exact', head: true })
    .gte('used_at', today.toISOString());

  return {
    total: totalCount || 0,
    used: usedCount || 0,
    todayUsed: todayCount || 0
  };
};

export const getMarketingInsights = async () => {
  const { data, error } = await supabase
    .from('redemption_codes')
    .select('pet_type, final_mbti')
    .eq('is_used', true);

  if (error || !data) return { petTypes: { dog: 0, cat: 0 }, topMbtis: [] };

  const petTypes = { dog: 0, cat: 0 };
  const mbtiCounts: Record<string, number> = {};

  data.forEach(row => {
    if (row.pet_type === 'dog') petTypes.dog++;
    if (row.pet_type === 'cat') petTypes.cat++;

    if (row.final_mbti) {
      mbtiCounts[row.final_mbti] = (mbtiCounts[row.final_mbti] || 0) + 1;
    }
  });

  const topMbtis = Object.entries(mbtiCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([mbti, count]) => ({ mbti, count }));

  return { petTypes, topMbtis };
};

export const fetchCodes = async (
  page: number = 1,
  pageSize: number = 20,
  filters: { query?: string, batchId?: string, status?: string, startDate?: string, endDate?: string } = {}
) => {
  let queryBuilder = supabase
    .from('redemption_codes')
    .select('*', { count: 'exact' });

  if (filters.query) {
    queryBuilder = queryBuilder.ilike('code', `%${filters.query.trim()}%`);
  }
  if (filters.batchId) {
    queryBuilder = queryBuilder.eq('batch_id', filters.batchId);
  }
  if (filters.status === 'used') {
    queryBuilder = queryBuilder.eq('is_used', true);
  } else if (filters.status === 'unused') {
    queryBuilder = queryBuilder.eq('is_used', false);
  }
  if (filters.startDate) {
    const start = new Date(filters.startDate);
    start.setHours(0,0,0,0);
    queryBuilder = queryBuilder.gte('created_at', start.toISOString());
  }
  if (filters.endDate) {
    const end = new Date(filters.endDate);
    end.setHours(23,59,59,999);
    queryBuilder = queryBuilder.lte('created_at', end.toISOString());
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await queryBuilder
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Failed to fetch codes:', error);
    return { data: [], total: 0 };
  }
  return { data: data || [], total: count || 0 };
};

export const getBatchStats = async () => {
  const { data, error } = await supabase
    .from('redemption_codes')
    .select('batch_id, is_used');

  if (error || !data) return [];

  const batches: Record<string, { total: number, used: number }> = {};
  data.forEach(row => {
    const bid = row.batch_id || 'unknown';
    if (!batches[bid]) batches[bid] = { total: 0, used: 0 };
    batches[bid].total++;
    if (row.is_used) batches[bid].used++;
  });

  return Object.entries(batches).map(([batchId, stats]) => ({
    batchId,
    total: stats.total,
    used: stats.used
  }));
};

export const resetCodeDevice = async (id: string) => {
  const { error } = await supabase
    .from('redemption_codes')
    .update({ is_used: false, device_id: null, used_at: null, pet_type: null, base_mbti: null, final_mbti: null, owner_mbti: null })
    .eq('id', id);
  return !error;
};

export const invalidateCode = async (id: string) => {
  const { error } = await supabase
    .from('redemption_codes')
    .delete()
    .eq('id', id);
  return !error;
};
