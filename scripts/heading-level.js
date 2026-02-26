/**
 * 文章渲染后降级标题层级：保证全站仅 Banner 一个 h1，正文从 h2 起
 */
module.exports = function (hexo) {
  hexo.extend.filter.register('after_post_render', function (data) {
    if (!data.content) return data;
    var content = data.content;
    content = content.replace(/<\/h6>/gi, '<!--/H6-->').replace(/<h6>/gi, '<!--H6-->');
    content = content.replace(/<\/h5>/gi, '</h6>').replace(/<h5>/gi, '<h6>');
    content = content.replace(/<\/h4>/gi, '</h5>').replace(/<h4>/gi, '<h5>');
    content = content.replace(/<\/h3>/gi, '</h4>').replace(/<h3>/gi, '<h4>');
    content = content.replace(/<\/h2>/gi, '</h3>').replace(/<h2>/gi, '<h3>');
    content = content.replace(/<\/h1>/gi, '</h2>').replace(/<h1>/gi, '<h2>');
    content = content.replace(/<!--\/H6-->/gi, '</h6>').replace(/<!--H6-->/gi, '<h6>');
    data.content = content;
    return data;
  });
};
