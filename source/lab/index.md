---
title: 实验室 (The Lab)
date: 2026-03-10 12:00:00
layout: page
---

{% raw %}
<style>
/* 实验室卡片网格专属样式 */
.lab-container { max-width: 1000px; margin: 0 auto; padding: 20px 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.lab-header { text-align: center; margin-bottom: 40px; }
.lab-header h2 { font-size: 2rem; margin-bottom: 10px; color: var(--text-color, #24292f); }
.lab-header p { color: var(--text-muted, #57606a); font-size: 1.05rem; }
.lab-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 24px; }
.lab-card { display: flex; flex-direction: column; background: var(--card-bg, #ffffff); border: 1px solid var(--border-color, #d0d7de); border-radius: 16px; padding: 24px; text-decoration: none; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); position: relative; overflow: hidden; }
.lab-card:hover { transform: translateY(-5px); box-shadow: 0 12px 24px rgba(0,0,0,0.08); border-color: var(--accent-color, #0969da); }
.lab-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 20px; background: var(--icon-bg, #f6f8fa); color: var(--accent-color, #0969da); }
.lab-title { font-size: 1.25rem; font-weight: 700; margin: 0 0 10px 0; color: var(--text-color, #24292f); }
.lab-desc { font-size: 0.95rem; color: var(--text-muted, #57606a); line-height: 1.6; margin: 0 0 20px 0; flex-grow: 1; }
.lab-tags { display: flex; gap: 8px; flex-wrap: wrap; }
.lab-tag { font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 20px; background: var(--tag-bg, #f6f8fa); color: var(--tag-color, #57606a); }

/* 深色模式兼容 */
html[data-user-color-scheme="dark"] .lab-container { 
  --text-color: #e6edf3; --text-muted: #8b949e; --card-bg: #161b22; 
  --border-color: #30363d; --accent-color: #58a6ff; --icon-bg: rgba(88,166,255,0.1); 
  --tag-bg: #21262d; --tag-color: #8b949e; 
}
html[data-user-color-scheme="dark"] .lab-card:hover { box-shadow: 0 12px 24px rgba(0,0,0,0.3); }
</style>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div class="lab-container">
  <div class="lab-header">
    <h2>Experiments & Tools</h2>
    <p>一些纯前端的极客小玩具、微交互实验与效率工具</p>
  </div>
  
  <div class="lab-grid">
    <a href="/lab/prompt-builder/" class="lab-card">
      <div class="lab-icon"><i class="fa-solid fa-terminal"></i></div>
      <h3 class="lab-title">Prompt Builder</h3>
      <p class="lab-desc">纯前端的系统提示词结构化组装台。通过预设角色、约束条件与思维链开关，毫秒级实时生成可直接喂给本地 LLM 的优质 Prompt。</p>
      <div class="lab-tags">
        <span class="lab-tag">AI Agent</span>
        <span class="lab-tag">Productivity</span>
        <span class="lab-tag">Vanilla JS</span>
      </div>
    </a>

    <a href="/lab/coin-flip/" class="lab-card">
      <div class="lab-icon" style="color: #d29922; background: rgba(210,153,34,0.1);"><i class="fa-solid fa-coins"></i></div>
      <h3 class="lab-title">Coin Flip 3D</h3>
      <p class="lab-desc">修复了物理翻滚轴的抛硬币微交互组件。结合了简单的 CSS 3D 转换与真实的物理下落音效反馈，用于解决选择困难症。</p>
      <div class="lab-tags">
        <span class="lab-tag">CSS 3D</span>
        <span class="lab-tag">Micro-interaction</span>
      </div>
    </a>
    
    <a href="/lab/webar-gallery/" class="lab-card">
      <div class="lab-icon" style="color: #3fb950; background: rgba(46,160,67,0.1);"><i class="fa-solid fa-cube"></i></div>
      <h3 class="lab-title">WebAR Gallery</h3>
      <p class="lab-desc">基于 Three.js 和 WebXR 构建的空间照片展览室。将二维的摄影作品投射到三维的数字空间中沉浸式游览。</p>
      <div class="lab-tags">
        <span class="lab-tag">Three.js</span>
        <span class="lab-tag">WebGL</span>
      </div>
    </a>

    <a href="/lab/film-gallery/" class="lab-card">
      <div class="lab-icon" style="color: #a371f7; background: rgba(163,113,247,0.1);"><i class="fa-solid fa-film"></i></div>
      <h3 class="lab-title">胶片记忆</h3>
      <p class="lab-desc">复古胶片风格的无缝滚动画廊。支持点击放大预览，纯前端原生 Lightbox 实现，完美绕过 OSS 强制下载限制。</p>
      <div class="lab-tags">
        <span class="lab-tag">CSS 动画</span>
        <span class="lab-tag">Lightbox</span>
      </div>
    </a>
  </div>
</div>
{% endraw %}