/**
 * Google Antigravity 风格粒子背景 - 全站生效
 * 首页 banner 高，子页面 banner 低，统一动效
 */
(function () {
  document.body.classList.add('antigravity-home');

  const COLOR_STOPS = [
    { pos: 0, r: 255, g: 100, b: 80 },
    { pos: 0.2, r: 255, g: 180, b: 60 },
    { pos: 0.4, r: 120, g: 220, b: 140 },
    { pos: 0.6, r: 80, g: 160, b: 255 },
    { pos: 0.8, r: 160, g: 100, b: 255 },
    { pos: 1, r: 60, g: 80, b: 180 }
  ];

  function getColor(t) {
    t = Math.max(0, Math.min(1, t));
    for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
      if (t >= COLOR_STOPS[i].pos && t <= COLOR_STOPS[i + 1].pos) {
        const p = (t - COLOR_STOPS[i].pos) / (COLOR_STOPS[i + 1].pos - COLOR_STOPS[i].pos);
        const r = Math.round(COLOR_STOPS[i].r + (COLOR_STOPS[i + 1].r - COLOR_STOPS[i].r) * p);
        const g = Math.round(COLOR_STOPS[i].g + (COLOR_STOPS[i + 1].g - COLOR_STOPS[i].g) * p);
        const b = Math.round(COLOR_STOPS[i].b + (COLOR_STOPS[i + 1].b - COLOR_STOPS[i].b) * p);
        return "rgb(" + r + "," + g + "," + b + ")";
      }
    }
    return "rgb(255,180,60)";
  }

  function init() {
    var banner = document.getElementById("banner");
    if (!banner) return;

    var canvas = document.createElement("canvas");
    canvas.id = "antigravity-canvas";
    canvas.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none";
    banner.insertBefore(canvas, banner.firstChild);

    var mask = banner.querySelector(".mask");
    if (mask) mask.style.zIndex = "1";

    var ctx = canvas.getContext("2d");
    var particles = [];
    var mouseX = -9999, mouseY = -9999;
    var PARTICLE_COUNT = 220;
    var REPEL_RADIUS = 140;
    var REPEL_STRENGTH = 1.0;

    function resize() {
      var rect = banner.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (particles.length === 0) {
        for (var i = 0; i < PARTICLE_COUNT; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: 0, vy: 0,
            len: 4 + Math.random() * 8,
            angle: Math.random() * Math.PI * 2,
            t: Math.random()
          });
        }
      }
    }

    function dist(x1, y1, x2, y2) {
      return Math.hypot(x2 - x1, y2 - y1);
    }

    function animate() {
      if (!ctx.canvas.width) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      var rect = banner.getBoundingClientRect();
      var mx = mouseX - rect.left;
      var my = mouseY - rect.top;

      particles.forEach(function (p) {
        var d = dist(p.x, p.y, mx, my);
        if (d < REPEL_RADIUS && d > 0) {
          var f = (1 - d / REPEL_RADIUS) * REPEL_STRENGTH;
          var dx = (p.x - mx) / d * f * 18;
          var dy = (p.y - my) / d * f * 18;
          p.vx += dx;
          p.vy += dy;
        }
        p.vx += (Math.random() - 0.5) * 0.3;
        p.vy += (Math.random() - 0.5) * 0.3;
        p.vx *= 0.91;
        p.vy *= 0.91;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.x = (p.x + canvas.width) % canvas.width;
        if (p.y < 0 || p.y > canvas.height) p.y = (p.y + canvas.height) % canvas.height;

        var ex = p.x + Math.cos(p.angle) * p.len;
        var ey = p.y + Math.sin(p.angle) * p.len;
        ctx.strokeStyle = getColor(p.t);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(ex, ey);
        ctx.stroke();
      });

      requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    document.addEventListener("mouseleave", function () {
      mouseX = -9999;
      mouseY = -9999;
    });

    window.addEventListener("resize", resize);
    resize();
    animate();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
