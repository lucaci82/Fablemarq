(() => {
  const container = document.getElementById('wow-canvas');
  if (!container) return;

  const staticBackground = () => {
    container.style.background = 'radial-gradient(1000px 600px at 70% 25%, #141e3d, #0b1222)';
  };

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  if (reduceMotion || saveData || typeof window.THREE === 'undefined') {
    staticBackground();
    return;
  }

  const mobile = window.matchMedia('(max-width: 820px)').matches;
  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: mobile ? 'low-power' : 'high-performance'
    });
  } catch (_) {
    staticBackground();
    return;
  }

  const pixelRatioCap = mobile ? 1.25 : 1.6;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
  renderer.setSize(Math.max(container.clientWidth, 1), Math.max(container.clientHeight, 1), false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    55,
    Math.max(container.clientWidth, 1) / Math.max(container.clientHeight, 1),
    1,
    2000
  );
  camera.position.set(0, 0, 400);

  const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
  const frag = `precision highp float; varying vec2 vUv; uniform float uTime; uniform vec2 uScale;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
                 mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y); }
    float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.55; } return v; }
    void main(){
      vec2 uv=vUv*uScale;
      float t=uTime*0.06;
      vec2 q=vec2(fbm(uv+vec2(1.0,0.3)*t),fbm(uv+vec2(-0.5,0.7)*t));
      vec2 r=uv+2.0*q+vec2(t*1.2,-t*0.8);
      float c=fbm(r*1.6)*0.7+0.3*fbm(r*3.2);
      c=pow(abs(c),5.0);
      vec2 g=vUv-0.5;
      float vign=smoothstep(0.95,0.2,length(g));
      float glow=c*vign;
      vec3 dark=vec3(0.05,0.08,0.15);
      vec3 gold1=vec3(0.96,0.89,0.66);
      vec3 gold2=vec3(0.91,0.76,0.37);
      vec3 col=mix(dark,mix(gold2,gold1,clamp(glow*2.0,0.0,1.0)),glow);
      float a=smoothstep(0.0,0.2,glow);
      gl_FragColor=vec4(col,a);
    }`;

  const geo = new THREE.PlaneGeometry(1400, 900);
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScale: { value: new THREE.Vector2(mobile ? 2.5 : 3.0, mobile ? 2.5 : 3.0) }
    },
    transparent: true,
    vertexShader: vert,
    fragmentShader: frag,
    depthWrite: false
  });

  const caustics = new THREE.Mesh(geo, mat);
  caustics.position.set(0, 0, -60);
  scene.add(caustics);

  function makeRay(w, h, opacity, rot) {
    const c = document.createElement('canvas');
    c.width = mobile ? 128 : 256;
    c.height = mobile ? 128 : 256;
    const g = c.getContext('2d');
    if (!g) return null;
    const scale = c.width / 256;
    const grd = g.createRadialGradient(60 * scale, 128 * scale, 10 * scale, 60 * scale, 128 * scale, 160 * scale);
    grd.addColorStop(0, 'rgba(255,230,170,0.45)');
    grd.addColorStop(1, 'rgba(255,230,170,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, c.width, c.height);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
    mesh.rotation.z = rot;
    mesh.position.set(-120, 80, -120);
    return mesh;
  }

  const ray1 = makeRay(1200, 600, mobile ? 0.15 : 0.20, -0.35);
  const ray2 = makeRay(1200, 600, mobile ? 0.08 : 0.12, -0.15);
  if (ray1) scene.add(ray1);
  if (ray2) scene.add(ray2);

  const dustCount = mobile ? 90 : 280;
  const dgeom = new THREE.BufferGeometry();
  const arr = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount; i++) {
    arr[i * 3] = (Math.random() * 2 - 1) * 700;
    arr[i * 3 + 1] = (Math.random() * 2 - 1) * 400;
    arr[i * 3 + 2] = -Math.random() * 300;
  }
  dgeom.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const dmat = new THREE.PointsMaterial({
    size: mobile ? 1.5 : 1.8,
    color: 0xFFF2C4,
    transparent: true,
    opacity: mobile ? 0.25 : 0.35,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const dust = new THREE.Points(dgeom, dmat);
  scene.add(dust);

  let mx = 0;
  let my = 0;
  if (window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  function onResize() {
    const w = Math.max(container.clientWidth, 1);
    const h = Math.max(container.clientHeight, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioCap));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(onResize).observe(container);
  } else {
    window.addEventListener('resize', onResize, { passive: true });
  }

  const clock = new THREE.Clock();
  let raf = 0;
  let running = false;

  function tick() {
    if (!running) return;
    const t = clock.getElapsedTime();
    mat.uniforms.uTime.value = t;
    dust.rotation.y += mobile ? 0.00045 : 0.0008;
    if (ray1) ray1.position.x = -120 + Math.sin(t * 0.25) * 20;
    if (ray2) ray2.position.y = 80 + Math.cos(t * 0.18) * 14;
    camera.position.x += (mx * 14 - camera.position.x) * 0.02;
    camera.position.y += (-my * 9 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, -120);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  function start() {
    if (running) return;
    running = true;
    clock.start();
    tick();
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    clock.stop();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  onResize();
  start();
})();
