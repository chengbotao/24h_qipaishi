/**
 * 全局登录拦截跳转工具
 * @param {boolean} isLogin - 当前登录状态
 * @param {string} targetUrl - 已登录目标路径
 * @param {string} loginUrl - 未登录跳转登录页路径（默认通用登录页）
 * @returns {string} 最终跳转路径
 */
export function getTargetUrl(isLogin, targetUrl, loginUrl = '../login/login') {
  return isLogin ? targetUrl : loginUrl;
}

/**
 * 全局跳转方法（可选，直接处理跳转逻辑，更彻底）
 * @param {object} options - 跳转配置
 * options.isLogin: 登录状态
 * options.targetUrl: 目标路径
 * options.openType: 跳转类型（navigate/switchTab/redirectTo）
 * options.loginUrl: 登录页路径
 */
export function navigateWithAuth(options) {
  const {
    isLogin,
    targetUrl,
    openType = 'navigate',
    loginUrl = '../login/login'
  } = options;

  if (!isLogin) {
    wx.navigateTo({ url: loginUrl });
    return;
  }

  // 根据跳转类型执行对应跳转
  switch (openType) {
    case 'switchTab':
      wx.switchTab({ url: targetUrl });
      break;
    case 'redirectTo':
      wx.redirectTo({ url: targetUrl });
      break;
    case 'navigate':
    default:
      wx.navigateTo({ url: targetUrl });
      break;
  }
}