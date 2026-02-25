---
title: about
date: 2026-02-20 15:36:47
---
<p>不是一个旅游爱好者，但经常在世界各地折腾代码和摄影。</p>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/echarts@4.9.0/map/js/world.js"></script>

<div id="footprint-map" style="width: 100%; height: 500px; margin: 30px 0; border-radius: 12px; overflow: hidden; background-color: #f8f9fa;"></div>

<script>
  document.addEventListener("DOMContentLoaded", function() {
    var myChart = echarts.init(document.getElementById('footprint-map'));

    // --- 在这里录入你的足迹数据 ---
    // 数据格式：name (地名), value: [经度, 纬度], date (时间)
    
    // 居住地数据 (蓝点)
    var liveData = [
      { name: '深圳', value: [114.0579, 22.5431], date: '现在' },
      // 你可以在这里继续添加曾经居住过的城市...
    ];

    // 旅行地数据 (橙点)
    var travelData = [
      { name: '格雷梅', value: [34.8295, 38.6431], date: '2023.05' },
      { name: '雷克雅未克', value: [-21.9426, 64.1466], date: '2024.10' },
      { name: '东京', value: [139.6917, 35.6895], date: '2025.01' }
      // 用你的 A7C2 记录下的城市，都可以把坐标填在这里
    ];

    var option = {
      // 悬浮提示框配置
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          // 格式化为：2023.05 格雷梅
          return params.data.date + ' ' + params.data.name;
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textStyle: { color: '#333' }
      },
      // 图例 (居住 vs 旅行)
      legend: {
        bottom: 20,
        right: 20,
        data: ['居住', '旅行'],
        backgroundColor: '#fff',
        padding: [5, 15],
        borderRadius: 20,
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10
      },
      // 地图基础配置
      geo: {
        map: 'world',
        roam: true, // 允许鼠标缩放和平移
        zoom: 1.2,  // 初始缩放比例
        center: [60, 35], // 初始中心点 (大概在欧亚大陆中间)
        itemStyle: {
          areaColor: '#e0e4e8', // 陆地颜色 (类似 DIYgod 的浅灰色)
          borderColor: '#ffffff', // 国界线颜色
          borderWidth: 1
        },
        emphasis: {
          itemStyle: { areaColor: '#c8ced3' },
          label: { show: false } // 鼠标移到国家上不显示国家名
        }
      },
      // 散点图数据配置
      series: [
        {
          name: '居住',
          type: 'effectScatter', // 使用带有涟漪发光效果的散点图
          coordinateSystem: 'geo',
          data: liveData,
          symbolSize: 10,
          itemStyle: {
            color: '#3b82f6', // 蓝色
            borderColor: '#ffffff',
            borderWidth: 2
          },
          rippleEffect: { brushType: 'stroke' } // 发光圈样式
        },
        {
          name: '旅行',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          data: travelData,
          symbolSize: 8,
          itemStyle: {
            color: '#f97316', // 橙色
            borderColor: '#ffffff',
            borderWidth: 2
          },
          rippleEffect: { brushType: 'stroke' }
        }
      ]
    };

    myChart.setOption(option);
    
    // 窗口自适应
    window.addEventListener('resize', function() {
      myChart.resize();
    });
  });
</script>