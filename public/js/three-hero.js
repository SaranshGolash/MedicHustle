// three-hero.js
(function initHero() {
  const container = document.getElementById("hero3d");
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight || 400;

  const scene = new THREE.Scene();

  // Camera Setup
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
  camera.position.set(0, 0, 15);

  // Renderer Setup
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance opt
  container.appendChild(renderer.domElement);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7);
  scene.add(dirLight);

  const emeraldLight = new THREE.PointLight(0x10b981, 2, 20);
  emeraldLight.position.set(-5, 0, 5);
  scene.add(emeraldLight);

  // Floating "Papers" (Forms)
  const papers = [];
  // Thin box looks like a piece of paper
  const geometry = new THREE.BoxGeometry(2.2, 3, 0.05);

  for (let i = 0; i < 8; i++) {
    const material = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0xffffff : 0x10b981, // White or Emerald
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
      opacity: 0.9,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Spread them out
    mesh.position.set(
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4
    );

    mesh.rotation.z = Math.random() * Math.PI;
    mesh.rotation.x = Math.random() * 0.5;

    // Store random animation speeds
    mesh.userData = {
      speedY: 0.002 + Math.random() * 0.004,
      speedRot: 0.001 + Math.random() * 0.002,
      initialY: mesh.position.y,
    };

    scene.add(mesh);
    papers.push(mesh);
  }

  // Animation Loop
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;

    papers.forEach((paper, i) => {
      // Bobbing motion (Floating)
      paper.position.y = paper.userData.initialY + Math.sin(time + i) * 0.5;

      // Gentle rotation
      paper.rotation.y += paper.userData.speedRot;
      paper.rotation.z += paper.userData.speedRot * 0.5;
    });

    renderer.render(scene, camera);
  }
  animate();

  // Handle Resize
  window.addEventListener("resize", () => {
    const w = container.clientWidth;
    const h = container.clientHeight || 400;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
