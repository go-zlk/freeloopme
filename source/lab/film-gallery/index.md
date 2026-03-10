---
title: 胶片记忆 (Film Gallery)
date: 2026-03-11 12:00:00
layout: page
---

{% raw %}
<style>
/* 1. 外层容器：控制溢出和整体背景 */
.film-container {
  /* 突破父级容器限制的神仙 CSS 写法 */
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  
  overflow: hidden;
  background-color: #050505;
  padding: 30px 0;
  /* 更柔和的边缘羽化：0–20% 和 80–100% 渐变，照片进出更自然 */
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%);
}
/* 模拟胶片颗粒：低透明度噪声叠加层 */
.film-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  opacity: 0.05;
  pointer-events: none;
  z-index: 1;
}

/* 2. 胶片主体 & 无缝滚动动画 */
.film-track-outer {
  display: inline-block;
  will-change: transform;
  /* 背光：胶片与纯黑背景分离，微弱青蓝光晕 */
  filter: drop-shadow(0 0 80px rgba(0, 150, 200, 0.08)) drop-shadow(0 0 160px rgba(0, 100, 150, 0.04));
}
.film-track {
  display: flex;
  width: max-content;
  animation: scroll-left 30s linear infinite;
}

/* 鼠标悬停时暂停滚动 */
.film-container:hover .film-track {
  animation-play-state: paused;
}

/* 3. 胶片边框与齿孔：纯 CSS 模拟 35mm 机械齿孔 */
.film-frame {
  flex-shrink: 0;
  position: relative;
  background: #000000;
  padding: 24px 8px;
  margin: 0 2px;
  width: fit-content;
}
/* 顶部齿孔 (::before) */
.film-frame::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  width: 100%;
  height: 10px;
  opacity: 0.9;
  background-image: repeating-linear-gradient(to right, transparent 0, transparent 8px, #0a0a0a 8px, #0a0a0a 16px);
}
/* 底部齿孔 (::after) */
.film-frame::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 6px;
  width: 100%;
  height: 10px;
  opacity: 0.9;
  background-image: repeating-linear-gradient(to right, transparent 0, transparent 8px, #0a0a0a 8px, #0a0a0a 16px);
}

/* 4. 照片嵌入：保持原图比例，不裁剪 */
.film-frame img {
  display: block;
  height: 200px;
  width: auto;
  object-fit: contain;
  border-radius: 2px;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 0 0 2px rgba(255, 255, 255, 0.03);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  filter: grayscale(30%) contrast(1.1);
}

/* 鼠标放在单张照片上的微交互 */
.film-frame img:hover {
  transform: scale(1.02);
  filter: grayscale(0%); /* 悬停时恢复鲜艳色彩 */
}

/* 5. 无缝滚动的关键帧：向左移动一半的距离 */
@keyframes scroll-left {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* --- 极客原生大图预览层 (Lightbox) --- */
.film-lightbox {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px); /* 毛玻璃效果 */
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.film-lightbox.active {
  opacity: 1;
  pointer-events: auto;
}
.film-lightbox .lightbox-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 90vw;
}
.film-lightbox img {
  max-width: 90vw;
  max-height: 75vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 40px rgba(0,0,0,0.6);
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.film-lightbox.active img {
  transform: scale(1); /* 弹出时的微距放大动画 */
}
.lightbox-caption {
  padding: 10px 20px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.4));
  border-radius: 8px;
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-align: center;
  opacity: 0;
  transform: translateY(-8px);
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.film-lightbox.active .lightbox-caption {
  opacity: 1;
  transform: translateY(0);
}
</style>

<div class="film-container">
  <div class="film-track-outer" id="film-track-outer">
    <div class="film-track" id="film-track">
    </div>
  </div>
</div>

<div class="film-lightbox" id="film-lightbox">
  <div class="lightbox-content">
    <img id="lightbox-img" src="" alt="Enlarged" />
    <div id="lightbox-caption" class="lightbox-caption"></div>
  </div>
</div>

<script src="/assets/js/photos.js"></script>
<script>
  const filmPhotos = window.PHOTO_URLS || [];

  const track = document.getElementById('film-track');
  const trackOuter = document.getElementById('film-track-outer');
  const container = document.querySelector('.film-container');
  const lightbox = document.getElementById('film-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  const DEFAULT_CAPTION = 'SONY';

  // 1. 渲染照片 (去掉 <a> 标签，改用事件代理拦截，避免阿里云 OSS 强制下载)
  const renderPhotos = () => {
    let htmlContent = '';
    filmPhotos.forEach(url => {
      htmlContent += `
        <div class="film-frame">
          <img src="${url}" style="cursor: zoom-in;" alt="Film Memory" data-caption="${DEFAULT_CAPTION}" loading="lazy" />
        </div>
      `;
    });
    return htmlContent;
  };

  track.innerHTML = renderPhotos() + renderPhotos();

  // 2. 事件代理：监听整个胶片带的点击事件
  track.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      const img = e.target;
      lightboxImg.setAttribute('src', img.getAttribute('src'));
      lightboxCaption.textContent = img.getAttribute('data-caption') || img.getAttribute('alt') || DEFAULT_CAPTION;
      lightbox.classList.add('active');
    }
  });

  // 3. 点击遮罩层任意位置，关闭放大镜
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  // 4. 滚轮横向拖拽：悬停时用滚轮手动平移胶片（模拟胶片卷轴拖拽感）
  let manualOffset = 0;
  let targetOffset = 0;
  container.addEventListener('wheel', (e) => {
    e.preventDefault();
    targetOffset += e.deltaY * 0.8;
    const trackWidth = track.offsetWidth;
    const halfWidth = trackWidth / 2;
    targetOffset = Math.max(-halfWidth, Math.min(halfWidth, targetOffset));
  }, { passive: false });

  function smoothPan() {
    manualOffset += (targetOffset - manualOffset) * 0.12;
    trackOuter.style.transform = `translateX(${manualOffset}px)`;
    requestAnimationFrame(smoothPan);
  }
  smoothPan();
</script>
{% endraw %}