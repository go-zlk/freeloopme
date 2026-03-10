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
  <div class="gallery-hint"><i class="fa-solid fa-hand-pointer"></i> 拖拽旋转视角 | 滚轮缩放 | 双击对焦/取消对焦 | 鼠标悬停照片暂停旋转</div>
</div>

<script src="/assets/js/photos.js"></script>
<script src="/assets/js/lab-utils.js"></script>
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
  // 相机初始位置在构建照片矩阵后设置，以适配动态半径

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace; // 确保照片色彩真实
  container.appendChild(renderer.domElement);

  // 2. 赛博感星空背景（根据主题切换粒子颜色，浅色模式用深色粒子）
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 500;
  const posArray = new Float32Array(starsCount * 3);
  for (let i = 0; i < starsCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
  }
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  const starsMaterial = new THREE.PointsMaterial({ size: 0.05, color: 0x58a6ff });
  const starField = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(starField);

  function updateStarColor() {
    const isDark = document.documentElement.getAttribute('data-user-color-scheme') === 'dark';
    starsMaterial.color.setHex(isDark ? 0x58a6ff : 0x0969da); // 深色模式亮蓝，浅色模式深蓝
  }
  updateStarColor();
  const themeObserver = new MutationObserver(updateStarColor);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-user-color-scheme'] });

  // 3. 添加环境光与点光源
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);
  const pointLight = new THREE.PointLight(0xffffff, 1.5);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  // 4. 构建环形照片矩阵（相册列表由 /assets/js/photos.js 统一维护）
  const photoUrls = window.PHOTO_URLS || [];
  const photoCount = Math.max(1, photoUrls.length);
  const photoWidth = 3.2;
  const photoHeight = 2.4;
  // 根据照片数量动态计算半径，避免相邻照片重叠（弦长 >= 画框宽度 * 1.1）
  const radius = Math.max(6, photoWidth * 1.1 / (2 * Math.sin(Math.PI / photoCount)));
  const defaultCameraZ = Math.max(8, radius + 3);
  camera.position.set(0, 0, defaultCameraZ);
  const group = new THREE.Group();
  scene.add(group);

  const textureLoader = new THREE.TextureLoader();
  // 跨域图片：先直连（OSS 配置 CORS 后可用），失败再用代理；代理有 413 限制，lab-utils 会请求 OSS 缩略图
  const loadTexture = (url, onLoad, onError) => {
    const isCrossOrigin = url.startsWith('http') && new URL(url, location.href).origin !== location.origin;
    if (!isCrossOrigin) {
      textureLoader.load(url, onLoad, undefined, onError);
      return;
    }
    const fallback = function() {
      const canvas = document.createElement('canvas');
      canvas.width = 256; canvas.height = 192;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#2d3748'; ctx.fillRect(0, 0, 256, 192);
      ctx.fillStyle = '#718096'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('加载失败', 128, 96);
      onLoad(new THREE.CanvasTexture(canvas));
    };
    textureLoader.load(url, onLoad, undefined, function() {
      (window.getCrossOriginImageUrl || function(u) { return Promise.resolve(u); })(url)
        .then(function(blobUrl) {
          textureLoader.load(blobUrl, function(tex) {
            if (blobUrl.startsWith('blob:')) URL.revokeObjectURL(blobUrl);
            onLoad(tex);
          }, undefined, fallback);
        })
        .catch(fallback);
    });
  };
  const geometry = new THREE.PlaneGeometry(photoWidth, photoHeight); // 4:3 画框

  // 星空顶效果：随机散落的亮点，无放射状
  const starSprite = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 48;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
    g.addColorStop(0, 'rgba(255,255,255,0.98)');
    g.addColorStop(0.2, 'rgba(220,240,255,0.7)');
    g.addColorStop(0.5, 'rgba(180,220,255,0.2)');
    g.addColorStop(1, 'rgba(180,220,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(24, 24, 24, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(c);
  })();

  function createStarfieldParticles() {
    const w = photoWidth / 2, h = photoHeight / 2;
    const margin = 0.18;
    const particles = [];
    for (let i = 0; i < 120; i++) {
      const side = Math.floor(Math.random() * 4);
      let x, y;
      if (side === 0) { x = -w + Math.random() * w * 2; y = -h - Math.random() * margin; }
      else if (side === 1) { x = w + Math.random() * margin; y = -h + Math.random() * h * 2; }
      else if (side === 2) { x = w - Math.random() * w * 2; y = h + Math.random() * margin; }
      else { x = -w - Math.random() * margin; y = h - Math.random() * h * 2; }
      particles.push({
        x, y,
        phase: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.2,
        size: 0.02 + Math.random() * 0.05
      });
    }
    const bySize = [[],[],[]];
    particles.forEach(p => {
      const i = p.size < 0.035 ? 0 : p.size < 0.055 ? 1 : 2;
      bySize[i].push(p);
    });
    const group = new THREE.Group();
    group.visible = false;
    [0.035, 0.05, 0.07].forEach((baseSize, tier) => {
      const list = bySize[tier];
      if (list.length === 0) return;
      const geom = new THREE.BufferGeometry();
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(list.length * 3), 3));
      const mat = new THREE.PointsMaterial({
        size: baseSize,
        map: starSprite,
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      const pts = new THREE.Points(geom, mat);
      pts.userData.particleData = list;
      group.add(pts);
    });
    return group;
  }

  photoUrls.forEach((url, index) => {
    const angle = (index / photoCount) * Math.PI * 2;
    
    loadTexture(url, (texture) => {
      const material = new THREE.MeshStandardMaterial({ 
        map: texture, 
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.1
      });
      const mesh = new THREE.Mesh(geometry, material);
      const borderParticles = createStarfieldParticles();
      mesh.add(borderParticles);
      mesh.userData.borderParticles = borderParticles;
      
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.lookAt(0, 0, 0);
      
      group.add(mesh);
    });
  });

  // 5. 添加轨道控制器 (阻尼效果)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false; // 禁止平移，保持在中心
  controls.minDistance = 2;   // 最近距离
  controls.maxDistance = 15;  // 最远距离

  // 6. 射线检测：仅当鼠标在照片上时暂停旋转，双击对焦
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const worldPos = new THREE.Vector3();
  let targetCameraPos = null;
  let targetControlsLookAt = null;
  let hoveredMesh = null;
  let isFocused = false;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  });
  container.addEventListener('mouseleave', () => {
    if (hoveredMesh) {
      hoveredMesh.scale.setScalar(1);
      if (hoveredMesh.userData.borderParticles) hoveredMesh.userData.borderParticles.visible = false;
    }
    hoveredMesh = null;
    isFocused = false;
  });

  container.addEventListener('dblclick', (event) => {
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);

    if (isFocused) {
      // 再次双击：回到默认俯瞰视角
      targetCameraPos = new THREE.Vector3(0, 0, defaultCameraZ);
      targetControlsLookAt = new THREE.Vector3(0, 0, 0);
      isFocused = false;
    } else if (intersects.length > 0) {
      const target = intersects[0].object;
      target.getWorldPosition(worldPos);
      targetCameraPos = worldPos.clone().normalize().multiplyScalar(radius + 4);
      targetControlsLookAt = worldPos.clone();
      isFocused = true;
    }
  });

  // 7. 渲染循环：射线检测悬停、缩放与发光、自转
  const HOVER_SCALE = 1.08;

  function animate() {
    requestAnimationFrame(animate);

    // 射线检测：仅当鼠标在照片上时 hoveredMesh 有值
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(group.children);
    const newHovered = intersects.length > 0 ? intersects[0].object : null;

    // 重置上一张悬停照片的缩放与边框粒子
    if (hoveredMesh && hoveredMesh !== newHovered) {
      hoveredMesh.scale.setScalar(1);
      if (hoveredMesh.userData.borderParticles) hoveredMesh.userData.borderParticles.visible = false;
    }
    hoveredMesh = newHovered;

    // 当前悬停照片：轻微放大 + 边框发光粒子（无整图变蓝）
    if (hoveredMesh) {
      hoveredMesh.scale.lerp(new THREE.Vector3(HOVER_SCALE, HOVER_SCALE, HOVER_SCALE), 0.15);
      if (hoveredMesh.userData.borderParticles) {
        const bp = hoveredMesh.userData.borderParticles;
        bp.visible = true;
        const t = Date.now() * 0.001;
        bp.children.forEach(pts => {
          pts.material.opacity = 0.85 + Math.sin(t * 1.2) * 0.1;
          const data = pts.userData.particleData;
          const pos = pts.geometry.attributes.position.array;
          data.forEach((p, i) => {
            const twinkle = Math.sin(t * p.speed + p.phase) * 0.008;
            pos[i*3]   = p.x + Math.cos(t * 0.7 + p.phase) * twinkle;
            pos[i*3+1] = p.y + Math.sin(t * 0.9 + p.phase) * twinkle;
            pos[i*3+2] = 0.01;
          });
          pts.geometry.attributes.position.needsUpdate = true;
        });
      }
    }

    // 平滑相机对焦
    if (targetCameraPos && targetControlsLookAt) {
      camera.position.lerp(targetCameraPos, 0.05);
      controls.target.lerp(targetControlsLookAt, 0.05);
      if (camera.position.distanceTo(targetCameraPos) < 0.02) {
        targetCameraPos = null;
        targetControlsLookAt = null;
      }
    }

    // 仅当鼠标在照片上或双击对焦后暂停旋转
    if (!hoveredMesh && !isFocused) group.rotation.y += 0.001;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // 8. 监听容器大小变化，自适应重绘
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
  });
</script>
{% endraw %}