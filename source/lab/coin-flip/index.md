---
title: 抛硬币
date: 2026-02-20
layout: post
---

<style>
  .cf-container {
    max-width: 420px;
    margin: 0 auto;
    padding: 2.5rem 2rem;
    background: rgba(255,255,255,0.85);
    border-radius: 20px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
  html[data-user-color-scheme="dark"] .cf-container {
    background: rgba(37, 45, 56, 0.9);
    border-color: rgba(255,255,255,0.08);
    box-shadow: 0 8px 32px rgba(0,0,0,0.35);
  }

  /* 3D Coin Scene */
  .cf-scene {
    perspective: 1200px;
    padding: 2rem 0;
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cf-coin {
    width: 140px;
    height: 140px;
    position: relative;
    transform-style: preserve-3d;
  }
  .cf-coin.flipping-heads {
    animation: cf-toss-heads 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  }
  .cf-coin.flipping-tails {
    animation: cf-toss-tails 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
  }
  @keyframes cf-toss-heads {
    0% { transform: rotateY(0deg) rotateX(0deg); }
    100% { transform: rotateY(2520deg) rotateX(720deg); }
  }
  @keyframes cf-toss-tails {
    0% { transform: rotateY(0deg) rotateX(0deg); }
    100% { transform: rotateY(2700deg) rotateX(720deg); }
  }

  .cf-coin-face {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.8rem;
    font-weight: 700;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    box-shadow: inset 0 0 0 4px rgba(255,255,255,0.25),
                inset 0 0 20px rgba(0,0,0,0.15),
                0 6px 20px rgba(0,0,0,0.2);
  }
  .cf-coin-face--front {
    background: linear-gradient(135deg, #f7e8b0 0%, #e8c55c 25%, #d4a84b 50%, #b88a3a 75%, #9a6b20 100%);
    color: #4a3a10;
    text-shadow: 0 1px 2px rgba(255,255,255,0.5);
  }
  .cf-coin-face--back {
    background: linear-gradient(135deg, #f5e6a8 0%, #e0bc4a 25%, #c9a030 50%, #a67c1a 75%, #8b5e0a 100%);
    color: #3d2f0a;
    text-shadow: 0 1px 2px rgba(255,255,255,0.4);
    transform: rotateY(180deg);
  }
  html[data-user-color-scheme="dark"] .cf-coin-face {
    box-shadow: inset 0 0 0 4px rgba(255,255,255,0.15),
                inset 0 0 20px rgba(0,0,0,0.3),
                0 8px 24px rgba(0,0,0,0.5);
  }

  /* Coin edge ring */
  .cf-coin::before {
    content: '';
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    background: linear-gradient(90deg, #b8942e 0%, #d4a84b 20%, #e8c55c 50%, #d4a84b 80%, #b8942e 100%);
    z-index: -1;
    opacity: 0.85;
  }

  /* Button */
  .cf-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: #fff;
    background: linear-gradient(135deg, #30a9de 0%, #2185c7 100%);
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow: 0 4px 14px rgba(48, 169, 222, 0.4);
  }
  .cf-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(48, 169, 222, 0.5);
  }
  .cf-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .cf-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  .cf-btn svg {
    width: 1.1em;
    height: 1.1em;
    fill: currentColor;
  }

  /* Result badge */
  .cf-result {
    margin-top: 1.5rem;
    min-height: 2.2em;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cf-result-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 1.25rem;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    opacity: 0;
  }
  .cf-result-badge.visible {
    animation: cf-fade-in 0.4s ease forwards;
  }
  @keyframes cf-fade-in {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .cf-result-badge--heads {
    background: linear-gradient(135deg, rgba(234, 197, 92, 0.35) 0%, rgba(212, 168, 75, 0.25) 100%);
    color: #8b6914;
    border: 1px solid rgba(180, 140, 50, 0.4);
  }
  .cf-result-badge--tails {
    background: linear-gradient(135deg, rgba(180, 140, 50, 0.3) 0%, rgba(139, 105, 20, 0.2) 100%);
    color: #8b6914;
    border: 1px solid rgba(150, 110, 30, 0.35);
  }
  html[data-user-color-scheme="dark"] .cf-result-badge--heads,
  html[data-user-color-scheme="dark"] .cf-result-badge--tails {
    color: #e8c55c;
    border-color: rgba(232, 197, 92, 0.3);
  }
</style>

<div class="cf-container">
  <div class="cf-scene">
    <div id="cf-coin" class="cf-coin">
      <div class="cf-coin-face cf-coin-face--front" id="cf-front">字</div>
      <div class="cf-coin-face cf-coin-face--back" id="cf-back">花</div>
    </div>
  </div>

  <div style="text-align: center;">
    <button id="cf-btn" class="cf-btn">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>
      抛硬币
    </button>
  </div>

  <div id="cf-result" class="cf-result">
    <span id="cf-result-badge" class="cf-result-badge"></span>
  </div>
</div>

<script>
(function() {
  var coin = document.getElementById('cf-coin');
  var btn = document.getElementById('cf-btn');
  var badge = document.getElementById('cf-result-badge');

  function flip() {
    btn.disabled = true;
    badge.classList.remove('visible');
    badge.textContent = '';
    coin.classList.remove('flipping-heads', 'flipping-tails');
    coin.offsetHeight; /* force reflow to restart animation */

    var isHeads = Math.random() >= 0.5;
    coin.classList.add(isHeads ? 'flipping-heads' : 'flipping-tails');

    setTimeout(function() {
      badge.textContent = isHeads ? '正面 · 字' : '反面 · 花';
      badge.className = 'cf-result-badge visible cf-result-badge--' + (isHeads ? 'heads' : 'tails');
      btn.disabled = false;
    }, 1200);
  }

  btn.addEventListener('click', flip);
})();
</script>
