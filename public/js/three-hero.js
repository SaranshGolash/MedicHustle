// public/js/three-hero.js
(function initHero() {
  const container = document.getElementById("hero3d");
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight || 360;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
  camera.position.set(0, 0, 12);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Colors from CSS theme
  const emerald = 0x10b981;
  const emeraldDark = 0x059669;
  const gold = 0xf59e0b;

  const light = new THREE.PointLight(0xffffff, 1.2);
  light.position.set(5, 8, 10);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  const tiles = [];
  const tileGeo = new THREE.BoxGeometry(1.4, 1.4, 0.2);

  for (let i = 0; i < 12; i++) {
    const color = i % 3 === 0 ? emerald : i % 3 === 1 ? emeraldDark : gold;
    const mat = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.3,
      roughness: 0.2,
    });
    const mesh = new THREE.Mesh(tileGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 2
    );
    mesh.rotation.set(
      Math.random() * 0.5,
      Math.random() * 0.5,
      Math.random() * 0.5
    );
    scene.add(mesh);
    tiles.push(mesh);
  }

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    tiles.forEach((tile, idx) => {
      tile.position.y += Math.sin(t + idx) * 0.003;
      tile.rotation.y += 0.004;
      tile.rotation.x += 0.002;
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight || 360;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
