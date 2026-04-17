import * as THREE from "https://unpkg.com/three@0.162.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.162.0/examples/jsm/controls/OrbitControls.js";

const canvas = document.getElementById("earth-canvas");
if (!canvas) {
  throw new Error("Earth canvas not found.");
}

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0.35, 4.2);
scene.add(camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2.3;
controls.maxDistance = 8;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.35;

const ambient = new THREE.AmbientLight(0x6f86c9, 0.25);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xdce9ff, 1.8);
sun.position.set(5, 2, 5);
scene.add(sun);

const rim = new THREE.DirectionalLight(0x3ba7ff, 1.2);
rim.position.set(-3, 1.4, -4);
scene.add(rim);

const textureLoader = new THREE.TextureLoader();
const tx = {
  day: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg"),
  night: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_lights_2048.png"),
  bump: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_bump_2048.jpg"),
  specular: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg"),
  clouds: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png")
};

const earth = new THREE.Group();
scene.add(earth);

const globe = new THREE.Mesh(
  new THREE.SphereGeometry(1, 128, 128),
  new THREE.MeshPhongMaterial({
    map: tx.day,
    bumpMap: tx.bump,
    bumpScale: 0.045,
    specularMap: tx.specular,
    specular: new THREE.Color("#6e8db6"),
    shininess: 18,
    emissiveMap: tx.night,
    emissive: new THREE.Color("#ffc16d"),
    emissiveIntensity: 0.35
  })
);
earth.add(globe);

const cloudLayer = new THREE.Mesh(
  new THREE.SphereGeometry(1.01, 96, 96),
  new THREE.MeshPhongMaterial({
    map: tx.clouds,
    transparent: true,
    opacity: 0.45,
    depthWrite: false
  })
);
earth.add(cloudLayer);

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.07, 64, 64),
  new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      c: { value: 0.75 },
      p: { value: 3.4 },
      glowColor: { value: new THREE.Color("#3aa4ff") },
      viewVector: { value: camera.position }
    },
    vertexShader: `
      varying float intensity;
      uniform vec3 viewVector;
      uniform float c;
      uniform float p;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        intensity = pow(c - dot(vNormal, vNormel), p);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying float intensity;
      uniform vec3 glowColor;
      void main() {
        gl_FragColor = vec4(glowColor, intensity);
      }
    `
  })
);
earth.add(atmosphere);

const starField = new THREE.Mesh(
  new THREE.SphereGeometry(50, 64, 64),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/galaxy_starfield.png"),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.5
  })
);
scene.add(starField);

function latLonToVec3(lat, lon, radius = 1.05) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function createMapPin() {
  const group = new THREE.Group();

  const pinShape = new THREE.Shape();
  pinShape.moveTo(0, -0.56);
  pinShape.quadraticCurveTo(0.38, -0.15, 0.38, 0.18);
  pinShape.absarc(0, 0.18, 0.38, 0, Math.PI, true);
  pinShape.quadraticCurveTo(-0.38, -0.15, 0, -0.56);

  const hole = new THREE.Path();
  hole.absellipse(0, 0.18, 0.14, 0.14, 0, Math.PI * 2);
  pinShape.holes.push(hole);

  const pinMesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(pinShape, {
      depth: 0.11,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.03,
      bevelSegments: 5,
      curveSegments: 32
    }),
    new THREE.MeshStandardMaterial({
      color: "#f4413d",
      roughness: 0.26,
      metalness: 0.14
    })
  );
  pinMesh.rotation.x = Math.PI;
  pinMesh.rotation.z = Math.PI;
  pinMesh.scale.setScalar(0.15);
  pinMesh.castShadow = true;
  group.add(pinMesh);

  const centerDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(0.048, 0.048, 0.028, 32),
    new THREE.MeshStandardMaterial({ color: "#bd1d2c", roughness: 0.32, metalness: 0.2 })
  );
  centerDisc.rotation.x = Math.PI / 2;
  centerDisc.position.set(0, -0.005, 0.02);
  group.add(centerDisc);

  const pulse = new THREE.Mesh(
    new THREE.RingGeometry(0.08, 0.11, 64),
    new THREE.MeshBasicMaterial({ color: "#ff6a61", transparent: true, opacity: 0.45, side: THREE.DoubleSide })
  );
  pulse.rotation.x = Math.PI / 2;
  pulse.position.y = -0.001;
  group.add(pulse);

  group.userData.pulse = pulse;
  return group;
}

const markerLat = 40.7128;
const markerLon = -74.0060;
const marker = createMapPin();
const markerPos = latLonToVec3(markerLat, markerLon, 1.05);
marker.position.copy(markerPos);
marker.lookAt(markerPos.clone().multiplyScalar(2));
earth.add(marker);

const markerLight = new THREE.PointLight(0xff6f62, 2, 1.4, 2);
markerLight.position.copy(markerPos.clone().multiplyScalar(1.12));
earth.add(markerLight);

const clock = new THREE.Clock();

function onResize() {
  const stage = canvas.parentElement;
  const width = stage.clientWidth;
  const height = stage.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
}
window.addEventListener("resize", onResize);
onResize();

renderer.setAnimationLoop(() => {
  const elapsed = clock.getElapsedTime();
  cloudLayer.rotation.y += 0.0005;
  earth.rotation.y += 0.00035;
  starField.rotation.y += 0.00008;

  const pulse = marker.userData.pulse;
  const pulseScale = 1 + Math.sin(elapsed * 2.4) * 0.22;
  pulse.scale.setScalar(pulseScale);
  pulse.material.opacity = 0.3 + (Math.sin(elapsed * 2.4) * 0.5 + 0.5) * 0.3;

  controls.update();
  renderer.render(scene, camera);
});