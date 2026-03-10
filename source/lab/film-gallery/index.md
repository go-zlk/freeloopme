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
  background-color: #050505; /* 稍微加深一点背景 */
  padding: 30px 0; /* 上下留白加大，更大气 */
  /* 利用 CSS 遮罩，让左右两端 15% 的区域产生羽化渐变效果 */
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

/* 2. 胶片主体 & 无缝滚动动画 */
.film-track {
  display: flex;
  width: max-content;
  /* 调整 30s 改变滚动速度 */
  animation: scroll-left 30s linear infinite; 
}

/* 鼠标悬停时暂停滚动 */
.film-container:hover .film-track {
  animation-play-state: paused;
}

/* 3. 胶片边框与齿孔设计 (纯 CSS 绘制) */
.film-frame {
  flex-shrink: 0;
  background-color: #000000;
  padding: 32px 12px; /* 上下留出打孔的空间 */
  margin: 0 2px; /* 胶片之间的微小间隙 */
  
  /* 上下胶片齿孔效果 */
  background-image: 
    repeating-linear-gradient(to right, transparent 0px, transparent 12px, #2a2a2a 12px, #2a2a2a 20px),
    repeating-linear-gradient(to right, transparent 0px, transparent 12px, #2a2a2a 12px, #2a2a2a 20px);
  background-position: top 8px left 0, bottom 8px left 0;
  background-size: 100% 10px, 100% 10px;
  background-repeat: no-repeat;
}

/* 4. 照片样式 */
.film-frame img {
  display: block;
  height: 240px; 
  width: auto;
  object-fit: cover;
  border-radius: 2px;
  /* 增加一点相纸的厚度感 */
  border: 2px solid rgba(255, 255, 255, 0.1); 
  box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.8);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  filter: grayscale(30%) contrast(1.1); /* 加深胶片褪色感 */
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
.film-lightbox img {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 0 40px rgba(0,0,0,0.6);
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.film-lightbox.active img {
  transform: scale(1); /* 弹出时的微距放大动画 */
}
</style>

<div class="film-container">
  <div class="film-track" id="film-track">
  </div>
</div>

<div class="film-lightbox" id="film-lightbox">
  <img id="lightbox-img" src="" alt="Enlarged" />
</div>

<script>
  const filmPhotos = [
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08379.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08417.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08356.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08440.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08441.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08460.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08373.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08381.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08242.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC06715.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC06641.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC06685.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08804.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08588.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08595.webp',
  ];

  const track = document.getElementById('film-track');
  const lightbox = document.getElementById('film-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  // 1. 渲染照片 (去掉 <a> 标签，改用事件代理拦截，避免阿里云 OSS 强制下载)
  const renderPhotos = () => {
    let htmlContent = '';
    filmPhotos.forEach(url => {
      htmlContent += `
        <div class="film-frame">
          <img src="${url}" style="cursor: zoom-in;" alt="Film Memory" loading="lazy" />
        </div>
      `;
    });
    return htmlContent;
  };

  track.innerHTML = renderPhotos() + renderPhotos();

  // 2. 事件代理：监听整个胶片带的点击事件
  track.addEventListener('click', (e) => {
    if (e.target.tagName === 'IMG') {
      const imgSrc = e.target.getAttribute('src');
      lightboxImg.setAttribute('src', imgSrc);
      lightbox.classList.add('active');
    }
  });

  // 3. 点击遮罩层任意位置，关闭放大镜
  lightbox.addEventListener('click', () => {
    lightbox.classList.remove('active');
  });
</script>
{% endraw %}