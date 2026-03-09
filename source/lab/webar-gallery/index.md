---
title: WebAR 空间画廊
date: 2026-03-10 16:00:00
layout: page
---

{% raw %}
<style>
/* 画廊全屏容器样式 */
.gallery-wrapper {
  width: 100%;
  height: 75vh;
  min-height: 500px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-color, #0d1117);
  border: 1px solid var(--border-color, #30363d);
  box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
  position: relative;
  cursor: grab;
}
.gallery-wrapper:active {
  cursor: grabbing;
}
.gallery-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.6);
  font-size: 0.85rem;
  background: rgba(0,0,0,0.5);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  z-index: 10;
}
html[data-user-color-scheme="dark"] .gallery-wrapper {
  --bg-color: #0d1117; --border-color: #30363d;
}
html[data-user-color-scheme="light"] .gallery-wrapper {
  --bg-color: #f6f8fa; --border-color: #d0d7de; box-shadow: inset 0 0 30px rgba(0,0,0,0.05);
}
</style>

<div class="gallery-wrapper" id="webgl-container">
  <div class="gallery-hint"><i class="fa-solid fa-hand-pointer"></i> 拖拽旋转视角 | 滚轮缩放</div>
</div>

<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
    }
  }
</script>

<script type="module">
  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

  const container = document.getElementById('webgl-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  // 1. 初始化场景、相机与渲染器
  const scene = new THREE.Scene();
  // 留空背景色，让它透明以露出 CSS 设置的暗黑/浅色背景
  
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 8); // 相机后退，纵观全图

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 2. 添加环境光与点光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  // 3. 构建环形照片矩阵 (使用占位图供测试)
  // 这里可以替换为你 OSS 图床里的高清摄影原图直链
  const photoUrls = [
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08379.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08417.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08356.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08440.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08441.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08460.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08373.webp',
    'https://freeloop-assets.oss-cn-shenzhen.aliyuncs.com/photos/DSC08381.webp',
  ];

  const radius = 6; // 圆环半径
  const photoCount = photoUrls.length;
  const group = new THREE.Group();
  scene.add(group);

  const textureLoader = new THREE.TextureLoader();
  const geometry = new THREE.PlaneGeometry(3.2, 2.4); // 设置画框的宽高比 (4:3)

  photoUrls.forEach((url, index) => {
    // 计算每张照片在圆环上的角度
    const angle = (index / photoCount) * Math.PI * 2;
    
    // 加载纹理并创建材质
    textureLoader.load(url, (texture) => {
      // 使用 MeshStandardMaterial 让照片对光照有反应
      const material = new THREE.MeshStandardMaterial({ 
        map: texture, 
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      // 定位：根据极坐标计算 X 和 Z 坐标
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      
      // 旋转：让每张照片的法线都指向圆心
      mesh.lookAt(0, 0, 0);
      
      group.add(mesh);
    });
  });

  // 4. 添加轨道控制器 (阻尼效果)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false; // 禁止平移，保持在中心
  controls.minDistance = 2;   // 最近距离
  controls.maxDistance = 15;  // 最远距离

  // 5. 渲染循环与缓慢自转
  function animate() {
    requestAnimationFrame(animate);
    
    // 让整个照片组以极慢的速度自动旋转，增加沉浸感
    group.rotation.y += 0.001;
    
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 6. 监听容器大小变化，自适应重绘
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
</script>
{% endraw %}