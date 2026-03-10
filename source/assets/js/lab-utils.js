/**
 * 全站通用工具 - 跨域图片加载等
 * 使用方式：<script src="/assets/js/lab-utils.js"></script>
 */

(function () {
  /**
   * 获取可跨域加载的图片 URL（用于 WebGL/Canvas 等需要 CORS 的场景）
   * img 标签直接 src 不受限，但 TextureLoader 需要 CORS
   * 代理有大小限制(413)，阿里云 OSS 通过 x-oss-process 请求缩略图绕过
   * @param {string} url - 原始图片 URL
   * @returns {Promise<string>} - 可用的 URL（blob 或原 URL）
   */
  window.getCrossOriginImageUrl = function (url) {
    const isCrossOrigin = url.startsWith('http') && new URL(url, location.href).origin !== location.origin;
    if (!isCrossOrigin) return Promise.resolve(url);

    // 阿里云 OSS：请求缩略图避免代理 413 (Content Too Large)
    var fetchUrl = url;
    if (/aliyuncs\.com|oss-cn-/.test(url)) {
      var sep = url.indexOf('?') >= 0 ? '&' : '?';
      fetchUrl = url + sep + 'x-oss-process=image/resize,w_1200';
    }

    var proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(fetchUrl);
    return fetch(proxyUrl)
      .then(function (r) {
        if (!r.ok) throw new Error('fetch failed: ' + r.status);
        return r.blob();
      })
      .then(function (blob) {
        return URL.createObjectURL(blob);
      });
  };
})();
