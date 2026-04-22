import fpPromise from '@fingerprintjs/fingerprintjs';

// 获取单例 Promise
const fp = fpPromise.load();

/**
 * 获取当前浏览器的唯一设备指纹 (Device ID)
 * 该方法基于屏幕分辨率、字体、UA 等多种特征综合计算，
 * 比 LocalStorage 更难被普通用户篡改或转移。
 */
export const getDeviceFingerprint = async (): Promise<string> => {
  try {
    const instance = await fp;
    const result = await instance.get();
    return result.visitorId;
  } catch (error) {
    console.error('Failed to get device fingerprint, falling back to local ID', error);
    // 降级方案：如果获取失败，使用 LocalStorage 兜底
    let localId = localStorage.getItem('paws_fallback_device_id');
    if (!localId) {
      localId = 'fallback_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('paws_fallback_device_id', localId);
    }
    return localId;
  }
};
