---
title: lab
date: 2026-02-20 15:36:18
layout: page
---

<style>
  .lab-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    padding: 0;
  }
  .lab-card {
    display: block;
    padding: 1.25rem 1.5rem;
    border-radius: 8px;
    border: 1px solid #eaecef;
    background: #fff;
    text-decoration: none;
    color: inherit;
    transition: all 0.2s ease;
  }
  .lab-card:hover {
    border-color: #30a9de;
    box-shadow: 0 4px 12px rgba(48, 169, 222, 0.15);
  }
  .lab-card__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem 0;
    color: #1a202c;
  }
  .lab-card__desc {
    font-size: 0.9rem;
    color: #718096;
    margin: 0;
    line-height: 1.5;
  }
  html[data-user-color-scheme="dark"] .lab-card {
    border-color: #435266;
    background: #252d38;
  }
  html[data-user-color-scheme="dark"] .lab-card:hover {
    border-color: #30a9de;
    box-shadow: 0 4px 12px rgba(48, 169, 222, 0.25);
  }
  html[data-user-color-scheme="dark"] .lab-card__title {
    color: #c4c6c9;
  }
  html[data-user-color-scheme="dark"] .lab-card__desc {
    color: #a7a9ad;
  }
</style>

<div class="lab-grid">
  <a href="/lab/coin-flip/" class="lab-card">
    <h3 class="lab-card__title">抛硬币</h3>
    <p class="lab-card__desc">随机生成正面或反面，帮你做决策。</p>
  </a>
  <a href="/categories/技术/" class="lab-card">
    <h3 class="lab-card__title">示例工具 A</h3>
    <p class="lab-card__desc">技术类知识卡片，点击进入技术分类下的文章列表。</p>
  </a>
  <a href="/archives/" class="lab-card">
    <h3 class="lab-card__title">示例工具 B</h3>
    <p class="lab-card__desc">归档入口，快速浏览按时间排列的所有文章。</p>
  </a>
</div>
