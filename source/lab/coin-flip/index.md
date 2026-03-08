---
title: 抛硬币
date: 2026-02-20
layout: post
---

<style>
  .cf-container {
    max-width: 440px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    background: linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.9) 100%);
    border-radius: 24px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 12px 48px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.5) inset;
  }
  html[data-user-color-scheme="dark"] .cf-container {
    background: linear-gradient(165deg, rgba(30, 38, 50, 0.95) 0%, rgba(25, 32, 42, 0.9) 100%);
    border-color: rgba(255,255,255,0.08);
    box-shadow: 0 12px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset;
  }

  /* 3D Scene：perspective 必须作用于 3D 子元素 */
  .cf-scene {
    perspective: 1200px;
    transform-style: preserve-3d;
    padding: 2.5rem 0;
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  /* 地面阴影：升空时变小变淡，落地时变大变深 */
  .cf-scene::after {
    content: '';
    position: absolute;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 24px;
    background: radial-gradient(ellipse 50% 100% at 50% 0%, rgba(0,0,0,0.18), transparent);
    border-radius: 50%;
    filter: blur(6px);
    pointer-events: none;
  }
  .cf-scene.cf-tossing::after {
    animation: cf-shadow 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }
  @keyframes cf-shadow {
    0%, 100% { width: 120px; height: 24px; opacity: 1; }
    50% { width: 70px; height: 14px; opacity: 0.4; }
  }
  html[data-user-color-scheme="dark"] .cf-scene::after {
    background: radial-gradient(ellipse 50% 100% at 50% 0%, rgba(0,0,0,0.5), transparent);
  }
  html[data-user-color-scheme="dark"] .cf-scene.cf-tossing::after {
    animation: cf-shadow 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  /* Coin 容器：旋转父容器，必须 preserve-3d。勿加 filter，会破坏背面渲染 */
  .cf-coin {
    width: 150px;
    height: 150px;
    position: relative;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    cursor: pointer;
  }

  /* 抛物线层：仅负责 translateY + scale */
  .cf-coin-toss {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    border-radius: 50%;
  }
  .cf-coin-toss.cf-tossing {
    animation: cf-parabolic 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  @keyframes cf-parabolic {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    25% {
      transform: translateY(-70px) scale(1.18);
    }
    50% {
      transform: translateY(-100px) scale(1.28);
    }
    75% {
      transform: translateY(-40px) scale(1.08);
    }
  }

  /* 旋转层：JS 内联 style 设置 rotateY，transition 丝滑旋转。注意：不能加 filter，会破坏 3D 背面的 backface-visibility */
  .cf-coin-3d {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    border-radius: 50%;
    transition: transform 2.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* 正反面：position absolute 重叠，backface-visibility 关键 */
  .cf-coin-face {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 50%;
    overflow: hidden;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
  }
  .cf-coin-face img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: 50%;
  }
  /* 正面：朝向屏幕 */
  .cf-coin-face--front {
    transform: rotateY(0deg);
  }
  /* 反面：初始背对屏幕，必须 rotateY(180deg) */
  .cf-coin-face--back {
    transform: rotateY(180deg);
  }

  /* 结果提示 */
  .cf-result {
    text-align: center;
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 500;
    color: rgba(0,0,0,0.6);
    min-height: 1.5em;
  }
  html[data-user-color-scheme="dark"] .cf-result {
    color: rgba(255,255,255,0.7);
  }

  /* 按钮 */
  .cf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.9rem 2.25rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #3db8f0 0%, #2196d8 50%, #1976c2 100%);
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.4), 0 1px 0 rgba(255,255,255,0.2) inset;
  }
  .cf-btn:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 8px 24px rgba(33, 150, 243, 0.5), 0 1px 0 rgba(255,255,255,0.25) inset;
  }
  .cf-btn:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98);
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.35);
  }
  .cf-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
    transform: none;
  }
  .cf-btn:disabled svg {
    animation: cf-spin 1.2s linear infinite;
  }
  @keyframes cf-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .cf-btn svg {
    width: 1.15em;
    height: 1.15em;
    fill: currentColor;
  }

</style>

<div class="cf-container">
  <div class="cf-scene" id="cf-scene">
    <div id="cf-coin" class="cf-coin" title="点击抛掷">
      <div class="cf-coin-toss" id="cf-coin-toss">
        <div class="cf-coin-3d" id="cf-coin-3d">
          <div class="cf-coin-face cf-coin-face--front">
            <img src="/lab/coin-flip/images/coin-front.png" alt="正面" />
          </div>
          <div class="cf-coin-face cf-coin-face--back">
            <img src="/lab/coin-flip/images/coin-back.png" alt="反面" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div style="text-align: center;">
    <button id="cf-btn" class="cf-btn">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
      抛硬币
    </button>
    <div class="cf-result" id="cf-result" aria-live="polite"></div>
  </div>
</div>

<script>
(function() {
  var scene = document.getElementById('cf-scene');
  var coin = document.getElementById('cf-coin');
  var coinToss = document.getElementById('cf-coin-toss');
  var coin3d = document.getElementById('cf-coin-3d');
  var btn = document.getElementById('cf-btn');
  var resultEl = document.getElementById('cf-result');

  var currentRotation = 0; // 累加旋转角度，永不重置
  var DURATION = 2500;

  function flip() {
    if (coinToss.classList.contains('cf-tossing')) return;
    btn.disabled = true;
    resultEl.textContent = '';

    var isHeads = Math.random() >= 0.5;
    var baseTurns = 5 + Math.floor(Math.random() * 4); // 5~8 圈
    var endDeg = isHeads ? 0 : 180;
    var newAngle = currentRotation + baseTurns * 360 + endDeg;

    coin3d.style.transform = 'rotateY(' + newAngle + 'deg)';
    currentRotation = newAngle;

    coinToss.classList.add('cf-tossing');
    scene.classList.add('cf-tossing');

    var done = false;
    function onEnd() {
      if (done) return;
      done = true;
      coinToss.classList.remove('cf-tossing');
      scene.classList.remove('cf-tossing');
      btn.disabled = false;
      resultEl.textContent = isHeads ? '正面' : '反面';
    }

    coin3d.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'transform') {
        coin3d.removeEventListener('transitionend', handler);
        onEnd();
      }
    });
    setTimeout(onEnd, DURATION + 50);
  }

  btn.addEventListener('click', flip);
  coin.addEventListener('click', flip);
})();
</script>
