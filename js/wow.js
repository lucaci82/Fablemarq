
(() => {
  const container = document.getElementById('wow-canvas');
  if(!container) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    container.style.background = 'radial-gradient(1000px 600px at 70% 25%, #141e3d, #0b1222)';
    return;
  }
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, container.clientWidth/container.clientHeight, 1, 2000);
  camera.position.set(0, 0, 400);
  const vert = `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`;
  const frag = `precision highp float; varying vec2 vUv; uniform float uTime; uniform vec2 uScale;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
      return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
                 mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y); }
    float fbm(vec2 p){ float v=0.0, a=0.5; for(int i=0;i<5;i++){ v+=a*noise(p); p*=2.02; a*=0.55; } return v; }
    void main(){
      vec2 uv = vUv * uScale;
      float t = uTime*0.06;
      vec2 q = vec2(fbm(uv + vec2(1.0,0.3)*t), fbm(uv + vec2(-0.5,0.7)*t));
      vec2 r = uv + 2.0*q + vec2(t*1.2, -t*0.8);
      float c = fbm(r*1.6)*0.7 + 0.3*fbm(r*3.2);
      c = pow(abs(c), 5.0);
      vec2 g = vUv - 0.5; float vign = smoothstep(0.95, 0.2, length(g));
      float glow = c * vign;
      vec3 dark = vec3(0.05,0.08,0.15);
      vec3 gold1 = vec3(0.96,0.89,0.66);
      vec3 gold2 = vec3(0.91,0.76,0.37);
      vec3 col = mix(dark, mix(gold2, gold1, clamp(glow*2.0,0.0,1.0)), glow);
      float a = smoothstep(0.0, 0.2, glow);
      gl_FragColor = vec4(col, a);
    }`;
  const geo = new THREE.PlaneGeometry(1400, 900);
  const mat = new THREE.ShaderMaterial({
    uniforms:{ uTime:{value:0}, uScale:{value:new THREE.Vector2(3.0,3.0)} },
    transparent:true, vertexShader:vert, fragmentShader:frag, depthWrite:false
  });
  const caustics = new THREE.Mesh(geo, mat);
  caustics.position.set(0,0,-60);
  scene.add(caustics);
  function makeRay(w,h,opacity,rot){
    const c = document.createElement('canvas'); c.width=256; c.height=256;
    const g = c.getContext('2d'); const grd = g.createRadialGradient(60,128,10,60,128,160);
    grd.addColorStop(0,'rgba(255,230,170,0.45)'); grd.addColorStop(1,'rgba(255,230,170,0)');
    g.fillStyle=grd; g.fillRect(0,0,256,256);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const m = new THREE.MeshBasicMaterial({map:tex, transparent:true, opacity, blending:THREE.AdditiveBlending, depthWrite:false});
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w,h), m);
    mesh.rotation.z = rot; mesh.position.set(-120, 80, -120); return mesh;
  }
  const ray1 = makeRay(1200,600,0.20,-0.35);
  const ray2 = makeRay(1200,600,0.12,-0.15);
  scene.add(ray1, ray2);
  const dustCount = (container.clientWidth<700) ? 180 : 360;
  const dgeom = new THREE.BufferGeometry();
  const arr = new Float32Array(dustCount*3);
  for(let i=0;i<dustCount;i++){ arr[i*3]=(Math.random()*2-1)*700; arr[i*3+1]=(Math.random()*2-1)*400; arr[i*3+2]=-Math.random()*300; }
  dgeom.setAttribute('position', new THREE.BufferAttribute(arr,3));
  const dmat = new THREE.PointsMaterial({size:1.8, color:0xFFF2C4, transparent:true, opacity:0.35, depthWrite:false, blending:THREE.AdditiveBlending});
  const dust = new THREE.Points(dgeom,dmat); scene.add(dust);
  let mx=0,my=0; window.addEventListener('mousemove', e => { mx=(e.clientX/window.innerWidth)*2-1; my=(e.clientY/window.innerHeight)*2-1; }, {passive:true});
  function onResize(){ const w=container.clientWidth,h=container.clientHeight; renderer.setSize(w,h); camera.aspect=w/h; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', onResize);
  const clock = new THREE.Clock();
  function tick(){ const t = clock.getElapsedTime(); mat.uniforms.uTime.value=t; dust.rotation.y+=0.0008; ray1.position.x=-120+Math.sin(t*0.25)*20; ray2.position.y=80+Math.cos(t*0.18)*14; camera.position.x+=(mx*14-camera.position.x)*0.02; camera.position.y+=(-my*9-camera.position.y)*0.02; camera.lookAt(0,0,-120); renderer.render(scene,camera); requestAnimationFrame(tick); }
  tick();
})();