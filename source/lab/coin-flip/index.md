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
    display: flex;
    flex-direction: column;
    align-items: center;
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
    min-height: 380px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  /* 硬币 + 阴影 包装器 */
  .cf-coin-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
  }
  /* Coin 容器：旋转父容器，必须 preserve-3d。勿加 filter，会破坏背面渲染 */
  .cf-coin {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    cursor: pointer;
  }
  /* 地面阴影：随硬币抛起/落下动态变化 */
  .coin-shadow {
    position: absolute;
    left: 50%;
    bottom: -28px;
    transform: translateX(-50%);
    width: 90px;
    height: 20px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    filter: blur(4px);
    pointer-events: none;
  }
  .cf-coin-wrapper.cf-tossing .coin-shadow {
    animation: shadow-shrink 1.5s cubic-bezier(0.33, 0.7, 0.5, 1) forwards;
  }
  @keyframes shadow-shrink {
    0%, 100% {
      transform: translateX(-50%) scale(1);
      opacity: 1;
      filter: blur(4px);
    }
    50% {
      transform: translateX(-50%) scale(0.4);
      opacity: 0.1;
      filter: blur(8px);
    }
  }
  html[data-user-color-scheme="dark"] .coin-shadow {
    background: rgba(0, 0, 0, 0.6);
  }

  /* 抛物线层（外层）：位移 + 缩放 + 倾斜，倾斜融进关键帧实现丝滑落地 */
  .cf-coin-toss {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    border-radius: 50%;
  }
  .cf-coin-toss.cf-tossing {
    animation: coin-jump 1.5s forwards;
  }
  @keyframes coin-jump {
    0% {
      transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
      animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    50% {
      transform: translateY(-200px) scale(1.3) rotateX(20deg) rotateZ(-8deg);
      animation-timing-function: cubic-bezier(0.55, 0.085, 0.68, 0.53);
    }
    100% {
      transform: translateY(0) scale(1) rotateX(0deg) rotateZ(0deg);
    }
  }

  /* 旋转层：JS 仅控制 rotateY（正反面），倾斜由父层 keyframes 负责 */
  .cf-coin-3d {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    transform: rotateY(0deg);
    transform-style: preserve-3d;
    -webkit-transform-style: preserve-3d;
    border-radius: 50%;
    transition: transform 1.5s cubic-bezier(0.33, 0.7, 0.5, 1);
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
  .cf-coin-face::after {
    content: '';
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.6) 50%, transparent 80%);
    background-size: 200% 200%;
    mix-blend-mode: overlay;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    pointer-events: none;
  }
  .cf-coin-toss.cf-tossing .cf-coin-face::after {
    animation: shine 1.5s cubic-bezier(0.33, 0.7, 0.5, 1) forwards;
  }
  @keyframes shine {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
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
  /* 反面 Tails：最底层 Z-0 */
  .cf-coin-face--back {
    transform: rotateY(180deg) translateZ(0px);
  }
  /* 正面 Heads：最顶层 Z-11 */
  .cf-coin-face--front {
    transform: rotateY(0deg) translateZ(11px);
  }

  /* 硬币侧边「肉」：10 层金属银，Z-1 到 Z-10 */
  .cf-coin-edge {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    border-radius: 50%;
    background-color: #b0b0b0;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.15);
    transform-style: preserve-3d;
  }
  .cf-coin-edge--1 { transform: translateZ(1px); }
  .cf-coin-edge--2 { transform: translateZ(2px); }
  .cf-coin-edge--3 { transform: translateZ(3px); }
  .cf-coin-edge--4 { transform: translateZ(4px); }
  .cf-coin-edge--5 { transform: translateZ(5px); }
  .cf-coin-edge--6 { transform: translateZ(6px); }
  .cf-coin-edge--7 { transform: translateZ(7px); }
  .cf-coin-edge--8 { transform: translateZ(8px); }
  .cf-coin-edge--9 { transform: translateZ(9px); }
  .cf-coin-edge--10 { transform: translateZ(10px); }

  /* 按钮区域：与硬币垂直居中排布 */
  .cf-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 0.5rem;
  }
  /* 结果提示 */
  .cf-result {
    text-align: center;
    margin-top: 0.75rem;
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
    <div class="cf-coin-wrapper" id="cf-coin-wrapper">
      <div id="cf-coin" class="cf-coin" title="点击抛掷">
        <div class="cf-coin-toss" id="cf-coin-toss">
          <div class="cf-coin-3d" id="cf-coin-3d">
            <div class="cf-coin-face cf-coin-face--back">
              <img src="/lab/coin-flip/images/coin-back.png" alt="反面" />
            </div>
            <div class="cf-coin-edge cf-coin-edge--1"></div>
            <div class="cf-coin-edge cf-coin-edge--2"></div>
            <div class="cf-coin-edge cf-coin-edge--3"></div>
            <div class="cf-coin-edge cf-coin-edge--4"></div>
            <div class="cf-coin-edge cf-coin-edge--5"></div>
            <div class="cf-coin-edge cf-coin-edge--6"></div>
            <div class="cf-coin-edge cf-coin-edge--7"></div>
            <div class="cf-coin-edge cf-coin-edge--8"></div>
            <div class="cf-coin-edge cf-coin-edge--9"></div>
            <div class="cf-coin-edge cf-coin-edge--10"></div>
            <div class="cf-coin-face cf-coin-face--front">
              <img src="/lab/coin-flip/images/coin-front.png" alt="正面" />
            </div>
          </div>
        </div>
      </div>
      <div class="coin-shadow"></div>
    </div>
  </div>

  <div class="cf-actions">
    <button id="cf-btn" class="cf-btn">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
      抛硬币
    </button>
    <div class="cf-result" id="cf-result" aria-live="polite"></div>
  </div>
</div>

<script>
(function() {
  var coinWrapper = document.getElementById('cf-coin-wrapper');
  var coin = document.getElementById('cf-coin');
  var coinToss = document.getElementById('cf-coin-toss');
  var coin3d = document.getElementById('cf-coin-3d');
  var btn = document.getElementById('cf-btn');
  var resultEl = document.getElementById('cf-result');

  var currentRotation = 0;
  var DURATION = 1500;

  var flipAudio = new Audio('/lab/coin-flip/sound/drop.mp3');  /* 抛起时播放 */
  var dropAudio = new Audio('/lab/coin-flip/sound/flip.mp3');  /* 落地时播放 */

  function flip() {
    if (coinToss.classList.contains('cf-tossing')) return;
    btn.disabled = true;
    resultEl.textContent = '';

    var isHeads = Math.random() >= 0.5;
    var baseTurns = 5 + Math.floor(Math.random() * 4);
    var endDeg = isHeads ? 0 : 180;
    var newAngle = currentRotation + baseTurns * 360 + endDeg;

    coin3d.style.transform = 'rotateY(' + newAngle + 'deg)';
    currentRotation = newAngle;

    coinToss.classList.add('cf-tossing');
    coinWrapper.classList.add('cf-tossing');

    flipAudio.currentTime = 0;
    flipAudio.play().catch(function() {});

    var done = false;
    function onEnd() {
      if (done) return;
      done = true;
      coinToss.classList.remove('cf-tossing');
      coinWrapper.classList.remove('cf-tossing');
      btn.disabled = false;
      resultEl.textContent = isHeads ? '正面' : '反面';

      dropAudio.currentTime = 0;
      dropAudio.play().catch(function() {});

      if (navigator.vibrate) {
        navigator.vibrate([30, 50, 30]);
      }
    }

    coin3d.addEventListener('transitionend', function handler(e) {
      if (e.propertyName === 'transform') {
        coin3d.removeEventListener('transitionend', handler);
        onEnd();
      }
    });
    setTimeout(onEnd, DURATION + 100);
  }

  btn.addEventListener('click', flip);
  coin.addEventListener('click', flip);
})();
</script>
