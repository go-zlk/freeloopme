/**
 * Hexo 插件：生成完成后将 WebAR 原始 HTML 复制到 public，绕过 Hexo 渲染
 */
const fs = require('fs');
const path = require('path');

module.exports = function (hexo) {
  hexo.extend.filter.register('after_generate', function () {
    const root = hexo.base_dir;
    const src = path.join(root, 'source', 'lab', 'webar-hologram.html');
    const dest = path.join(root, 'public', 'lab', 'webar-hologram.html');
    try {
      if (fs.existsSync(src)) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        hexo.log.info('webar-hologram.html copied');
      }
    } catch (err) {
      hexo.log.error('copy-webar:', err.message);
    }
  });
};
