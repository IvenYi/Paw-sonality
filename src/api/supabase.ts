import { createClient } from '@supabase/supabase-js';

// 这里目前使用环境变量，你需要在项目根目录创建 .env.local 文件
// 并在其中填入你注册的 Supabase 对应信息
// VITE_SUPABASE_URL=https://your-project-id.supabase.co
// VITE_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 数据库表结构 (供参考):
 * table: redemption_codes
 * - id: uuid (primary key)
 * - code: varchar (unique) - 激活码
 * - is_used: boolean - 是否已核销
 * - device_id: varchar - 绑定的设备指纹
 * - used_at: timestamptz - 核销时间
 * - created_at: timestamptz - 创建时间
 */
