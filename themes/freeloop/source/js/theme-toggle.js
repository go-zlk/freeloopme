/**
 * 浅色/深色模式切换
 * 读写 localStorage，与 html[data-user-color-scheme] 配合
 */
(function () {
  var KEY = 'user-color-scheme';

  function getSaved() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  }

  function setScheme(scheme) {
    document.documentElement.setAttribute('data-user-color-scheme', scheme || 'light');
    try {
      if (scheme) {
        localStorage.setItem(KEY, scheme);
      } else {
        localStorage.removeItem(KEY);
      }
    } catch (e) {}
  }

  function getSystemPreferred() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function init() {
    var saved = getSaved();
    if (saved === 'dark' || saved === 'light') {
      setScheme(saved);
    } else {
      setScheme('light'); // 默认浅色模式
    }

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var cur = document.documentElement.getAttribute('data-user-color-scheme');
        var next = cur === 'dark' ? 'light' : 'dark';
        setScheme(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
