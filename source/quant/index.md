---
title: 量化监控舱 (Quant Dashboard)
date: 2026-03-10 15:00:00
layout: page
---

{% raw %}
<style>
/* 量化看板极客专属样式 */
.quant-container { max-width: 1000px; margin: 0 auto; padding: 20px 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
.quant-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--border-color, #30363d); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 10px; }
.quant-title { margin: 0; color: var(--text-color, #e6edf3); font-size: 1.5rem; display: flex; align-items: center; gap: 10px; }
.quant-meta { color: var(--text-muted, #8b949e); font-size: 0.85rem; font-family: ui-monospace, SFMono-Regular, Consolas, monospace; background: var(--bg-color, #161b22); padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border-color, #30363d); }
.chart-wrapper { width: 100%; background: var(--bg-color, #0d1117); border: 1px solid var(--border-color, #30363d); border-radius: 12px; padding: 20px; box-sizing: border-box; box-shadow: 0 8px 24px rgba(0,0,0,0.2); }
.chart-box { width: 100%; height: 500px; }

/* 简单的闪烁红绿灯动画，表示系统正在运行 */
.status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; background-color: #2ea043; box-shadow: 0 0 8px #2ea043; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

html[data-user-color-scheme="dark"] .quant-container {
  --text-color: #e6edf3; --text-muted: #8b949e; --border-color: #30363d; --bg-color: #0d1117;
}
html[data-user-color-scheme="light"] .quant-container {
  --text-color: #24292f; --text-muted: #57606a; --border-color: #d0d7de; --bg-color: #ffffff;
}
</style>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>

<div class="quant-container">
  <div class="quant-header">
    <h2 class="quant-title"><span class="status-dot"></span> NVDA 核心资产与策略监控</h2>
    <div class="quant-meta" id="update-time"><i class="fa-solid fa-satellite-dish"></i> 正在连接云端数据源...</div>
  </div>
  
  <div class="chart-wrapper">
    <div id="kline-chart" class="chart-box"></div>
  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  const chartDom = document.getElementById('kline-chart');
  // 判断当前系统主题，决定 ECharts 是深色还是浅色
  const isDark = document.documentElement.getAttribute('data-user-color-scheme') === 'dark';
  const myChart = echarts.init(chartDom, isDark ? 'dark' : null);
  const updateTimeEl = document.getElementById('update-time');

  // 显示极客风 Loading 动画
  myChart.showLoading({ 
    text: 'Syncing with GitHub Actions...', 
    color: '#58a6ff', 
    textColor: isDark ? '#8b949e' : '#57606a', 
    maskColor: isDark ? 'rgba(13, 17, 23, 0.8)' : 'rgba(255, 255, 255, 0.8)' 
  });

  // 发起 Fetch 请求，去拿 GitHub Actions 生成的那个 JSON
  fetch('/data/quant_nvda.json')
    .then(response => {
      if (!response.ok) throw new Error('未找到数据文件，请确认 GitHub Actions 是否已成功运行。');
      return response.json();
    })
    .then(data => {
      myChart.hideLoading();
      // 更新右上角的时间戳状态
      updateTimeEl.innerHTML = `<i class="fa-solid fa-clock"></i> 数据快照: ${data.last_updated}`;

      // 组装 ECharts 的渲染配置
      const option = {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
        legend: { data: ['日K线', 'SMA 20 (趋势线)'], textStyle: { color: isDark ? '#8b949e' : '#57606a' } },
        grid: { left: '8%', right: '5%', bottom: '15%', top: '10%' },
        xAxis: { 
          type: 'category', 
          data: data.dates, 
          scale: true, 
          boundaryGap: false, 
          axisLine: { onZero: false, lineStyle: { color: isDark ? '#30363d' : '#d0d7de' } }, 
          splitLine: { show: false }, 
          min: 'dataMin', 
          max: 'dataMax' 
        },
        yAxis: { 
          scale: true, 
          splitArea: { show: true, areaStyle: { color: isDark ? ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] : ['rgba(0,0,0,0.01)', 'rgba(0,0,0,0.03)'] } }, 
          splitLine: { show: true, lineStyle: { color: isDark ? '#30363d' : '#e1e4e8', type: 'dashed' } } 
        },
        dataZoom: [ 
          { type: 'inside', start: 40, end: 100 }, 
          { show: true, type: 'slider', top: '90%', start: 40, end: 100, textStyle: { color: isDark ? '#8b949e' : '#57606a' } } 
        ],
        series: [
          {
            name: '日K线',
            type: 'candlestick',
            data: data.k_data,
            // 华尔街配色：涨绿跌红
            itemStyle: { color: '#2ea043', color0: '#f85149', borderColor: '#2ea043', borderColor0: '#f85149' }
          },
          {
            name: 'SMA 20 (趋势线)',
            type: 'line',
            data: data.sma_20,
            smooth: true,
            lineStyle: { opacity: 0.8, color: '#58a6ff', width: 2 },
            symbol: 'none'
          }
        ]
      };
      myChart.setOption(option);
    })
    .catch(error => {
      myChart.hideLoading();
      updateTimeEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#f85149;"></i> 数据未同步`;
      console.error(error);
    });
    
  // 监听浏览器窗口变化，让图表永远自适应宽度
  window.addEventListener('resize', () => myChart.resize());
});
</script>
{% endraw %}