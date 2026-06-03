import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070b12);
scene.fog = new THREE.FogExp2(0x070b12, 0.02);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(30, 18, 30);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});

renderer.setSize(
  window.innerWidth,
  window.innerHeight
);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type =
  THREE.PCFSoftShadowMap;

document.body.appendChild(
  renderer.domElement
);

const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping = true;

const fogSettings = {
  color: '#070b12',
  density: 0.02
};

function updateFog() {
  scene.fog.color.set(fogSettings.color);
  scene.background.set(fogSettings.color);
  scene.fog.density = fogSettings.density;
}

const gui = new dat.GUI({ width: 310 });
const fogFolder = gui.addFolder('Fog');
fogFolder.addColor(fogSettings, 'color').name('Color').onChange(updateFog);
fogFolder.add(fogSettings, 'density', 0, 0.2, 0.005).name('Densidad').onChange(updateFog);
fogFolder.open();

updateFog();

// ILUMINACIÓN

const ambient =
  new THREE.AmbientLight(
    0xffffff,
    0.25
  );

scene.add(ambient);

const moon =
  new THREE.DirectionalLight(
    0xbcd7ff,
    1.5
  );

moon.position.set(
  40,
  60,
  20
);

moon.castShadow = true;

moon.shadow.mapSize.width = 2048;
moon.shadow.mapSize.height = 2048;

scene.add(moon);

// SUELO

const ground =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      200,
      200
    ),
    new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1a,
      roughness: 0.15,
      clearcoat: 1
    })
  );

ground.rotation.x =
  -Math.PI / 2;

ground.receiveShadow = true;

scene.add(ground);

// CARRETERA

const road =
  new THREE.Mesh(
    new THREE.PlaneGeometry(
      140,
      16
    ),
    new THREE.MeshStandardMaterial({
      color: 0x232323
    })
  );

road.rotation.x =
  -Math.PI / 2;

road.position.y = 0.01;

scene.add(road);

for (let i = -65; i < 65; i += 8) {

  const line =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        4,
        0.05,
        0.4
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })
    );

  line.position.set(
    i,
    0.05,
    0
  );

  scene.add(line);
}

// EDIFICIOS

for (let i = 0; i < 35; i++) {

  const h =
    5 + Math.random() * 18;

  const building =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        6,
        h,
        6
      ),
      new THREE.MeshStandardMaterial({
        color: 0x30353d
      })
    );

  building.position.set(
    (Math.random() - 0.5) * 180,
    h / 2,
    Math.random() > 0.5
      ? 25 + Math.random() * 40
      : -25 - Math.random() * 40
  );

  building.castShadow = true;
  building.receiveShadow = true;

  scene.add(building);
}

// FAROLAS

for (
  let i = -60;
  i <= 60;
  i += 20
) {

  const pole =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.15,
        0.15,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: 0x666666
      })
    );

  pole.position.set(
    i,
    4,
    10
  );

  scene.add(pole);

  const lamp =
    new THREE.PointLight(
      0xffeecc,
      1.8,
      25
    );

  lamp.position.set(
    i,
    8,
    10
  );

  scene.add(lamp);
}

function createPoliceCar(x, z) {

  const car = new THREE.Group();

  const body =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        5,
        1.2,
        2.4
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffffff
      })
    );

  const cabin =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        2.5,
        1.1,
        2.1
      ),
      new THREE.MeshStandardMaterial({
        color: 0x222222
      })
    );

  cabin.position.y = 1;

  car.add(body);
  car.add(cabin);

  for (let a of [-1.8, 1.8]) {

    for (let b of [-1.2, 1.2]) {

      const wheel =
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            0.45,
            0.45,
            0.4,
            12
          ),
          new THREE.MeshStandardMaterial({
            color: 0x111111
          })
        );

      wheel.rotation.z =
        Math.PI / 2;

        wheel.rotation.y =
        Math.PI / 2;

      wheel.position.set(
        a,
        -0.5,
        b
      );

      car.add(wheel);
    }
  }

  const red =
    new THREE.PointLight(
      0xff0000,
      2,
      25
    );

  const blue =
    new THREE.PointLight(
      0x0044ff,
      2,
      25
    );

  red.position.set(
    -0.3,
    1.8,
    0
  );

  blue.position.set(
    0.3,
    1.8,
    0
  );

  car.add(red);
  car.add(blue);

  car.position.set(
    x,
    1,
    z
  );

  scene.add(car);

  return {
    red,
    blue
  };
}

const patrolA =
  createPoliceCar(
    -10,
    -2
  );

const patrolB =
  createPoliceCar(
    10,
    2
  );

  // ==========================================
// PERSONAJES
// ==========================================

function createPerson(
  x,
  z,
  detective = false,
  hatColor = null
) {

  const person =
    new THREE.Group();

  const body =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.45,
        0.55,
        detective ? 2.2 : 1.8,
        8
      ),
      new THREE.MeshStandardMaterial({
        color: detective
          ? 0x3a2f2f
          : 0x0b2d6b
      })
    );

  body.castShadow = true;

  const head =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        0.35,
        12,
        12
      ),
      new THREE.MeshStandardMaterial({
        color: 0xf0c7a1
      })
    );

  head.position.y = 1.3;
  head.castShadow = true;

  person.add(body);
  person.add(head);

  const useHat = detective || hatColor !== null;
  if (useHat) {
    const color = detective
      ? 0x222222
      : hatColor;

    const hatMaterial =
      new THREE.MeshStandardMaterial({
        color
      });

    const hatTop =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.45,
          0.45,
          0.18,
          10
        ),
        hatMaterial
      );

    const hatBrim =
      new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.55,
          0.55,
          0.05,
          10
        ),
        hatMaterial
      );

    hatTop.position.y = 1.75;
    hatBrim.position.y = 1.66;

    const hat = new THREE.Group();
    hat.add(hatTop);
    hat.add(hatBrim);

    person.add(hat);
  }

  person.position.set(
    x,
    1,
    z
  );

  scene.add(person);

  return person;
}

const officer1 =
  createPerson(
    -3,
    5,
    false,
    0x0033cc
  );

const officer2 =
  createPerson(
    3,
    5,
    false,
    0x0033cc
  );

const detective =
  createPerson(
    1.8,
    -0.5,
    true
  );

// ==========================================
// CINTA PAPELOIDE
// ==========================================

function createPaperTape(
  x1,
  z1,
  x2,
  z2
) {

  const length =
    Math.sqrt(
      (x2 - x1) ** 2 +
      (z2 - z1) ** 2
    );

  const tape =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        length,
        0.12,
        0.05,
        70,
        1,
        1
      ),
      new THREE.MeshStandardMaterial({
        color: 0xffee33,
        roughness: 0.4,
        metalness: 0.05,
        side: THREE.DoubleSide
      })
    );

  tape.position.set(
    (x1 + x2) / 2,
    1.4,
    (z1 + z2) / 2
  );

  tape.rotation.y =
    Math.atan2(
      z2 - z1,
      x2 - x1
    );

  tape.castShadow = true;
  tape.receiveShadow = true;

  scene.add(tape);

  return tape;
}

const tape1 =
  createPaperTape(
    -15,
    -8,
    15,
    -8
  );

const tape2 =
  createPaperTape(
    -15,
    8,
    15,
    8
  );

// ==========================================
// CONOS DE TRÁFICO
// ==========================================

for (
  let i = -6;
  i <= 6;
  i += 2
) {

  const cone =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        0.35,
        1,
        10
      ),
      new THREE.MeshStandardMaterial({
        color: 0xff6a00
      })
    );

  cone.position.set(
    i,
    0.5,
    3
  );

  cone.castShadow = true;

  scene.add(cone);
}

// ==========================================
// EVIDENCIA
// ==========================================

const evidenceOffsets = [
  { x: -1.2, z: -0.8 },
  { x: 1.1, z: -0.9 },
  { x: -0.6, z: 0.7 },
  { x: 0.8, z: 0.6 }
];

for (const offset of evidenceOffsets) {
  const marker =
    new THREE.Mesh(
      new THREE.BoxGeometry(
        0.5,
        0.5,
        0.1
      ),
      new THREE.MeshStandardMaterial({
        color: 0xfff000
      })
    );

  marker.position.set(
    offset.x,
    0.25,
    offset.z - 1
  );

  marker.castShadow = true;

  scene.add(marker);
}

// ==========================================
// CINTA PAPELOIDE
// ==========================================

const paperCubeGeometry = new THREE.BoxGeometry(
  30,
  0.18,
  0.06,
  70,
  16,
  16
);
const paperCubeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffee33,
  roughness: 0.4,
  metalness: 0.05,
  side: THREE.DoubleSide
});

const paperCube = new THREE.Mesh(
  paperCubeGeometry,
  paperCubeMaterial
);
paperCube.position.set(-5, 2.1, -4);
paperCube.rotation.y = Math.PI / 12;
paperCube.castShadow = true;
paperCube.receiveShadow = true;
scene.add(paperCube);

const paperCubeOriginalPositions = paperCubeGeometry.attributes.position.array.slice();

// ==========================================
// SILUETA FORENSE
// ==========================================

function createForensicSilhouette(x, z) {
  const silhouette = new THREE.Group();

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });

  const head = new THREE.Mesh(
    new THREE.CircleGeometry(0.35, 32),
    material
  );
  head.rotation.x = -Math.PI / 2;
  head.position.set(0, 0.02, 0);
  silhouette.add(head);

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.05, 1.2),
    material
  );
  torso.position.set(0, 0.02, -0.9);
  silhouette.add(torso);

  const leftArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.05, 0.75),
    material
  );
  leftArm.rotation.y = Math.PI / 8;
  leftArm.position.set(-0.55, 0.02, -0.45);
  silhouette.add(leftArm);

  const rightArm = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.05, 0.75),
    material
  );
  rightArm.rotation.y = -Math.PI / 8;
  rightArm.position.set(0.55, 0.02, -0.45);
  silhouette.add(rightArm);

  const leftLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.05, 0.9),
    material
  );
  leftLeg.position.set(-0.18, 0.02, -1.75);
  silhouette.add(leftLeg);

  const rightLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.05, 0.9),
    material
  );
  rightLeg.position.set(0.18, 0.02, -1.75);
  silhouette.add(rightLeg);

  silhouette.position.set(x, 0, z);
  return silhouette;
}

const outline = createForensicSilhouette(0, -1);
scene.add(outline);

// ==========================================
// LLUVIA
// ==========================================

const rainCount = 10000;

const rainGeometry =
  new THREE.BufferGeometry();

const rainVertices = [];

for (
  let i = 0;
  i < rainCount;
  i++
) {

  rainVertices.push(
    (Math.random() - 0.5) * 200
  );

  rainVertices.push(
    Math.random() * 80
  );

  rainVertices.push(
    (Math.random() - 0.5) * 200
  );
}

rainGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(
    rainVertices,
    3
  )
);

const rainMaterial =
  new THREE.PointsMaterial({
    color: 0xaad4ff,
    size: 0.12,
    transparent: true,
    opacity: 0.65
  });

const rain =
  new THREE.Points(
    rainGeometry,
    rainMaterial
  );

scene.add(rain);

const rainPositions =
  rain.geometry.attributes.position;

// ==========================================
// CHARCOS REFLECTANTES
// ==========================================

for (
  let i = 0;
  i < 12;
  i++
) {

  const puddle =
    new THREE.Mesh(
      new THREE.CircleGeometry(
        1 + Math.random() * 2,
        24
      ),
      new THREE.MeshPhysicalMaterial({
        color: 0x222222,
        roughness: 0.05,
        clearcoat: 1,
        metalness: 0.3
      })
    );

  puddle.rotation.x =
    -Math.PI / 2;

  puddle.position.set(
    (Math.random() - 0.5) * 80,
    0.02,
    (Math.random() - 0.5) * 30
  );

  scene.add(puddle);
}

// ==========================================
// RELOJ
// ==========================================

const clock =
  new THREE.Clock();

// ==========================================
// ANIMACIÓN
// ==========================================

function animate() {

  requestAnimationFrame(
    animate
  );

  const t =
    clock.getElapsedTime();

  const paperPositions =
    paperCube.geometry.attributes.position;

  for (
    let i = 0;
    i < paperPositions.count;
    i++
  ) {
    const ix = i * 3;
    const oy = paperCubeOriginalPositions[ix + 1];
    const oz = paperCubeOriginalPositions[ix + 2];
    const ox = paperCubeOriginalPositions[ix];

    paperPositions.array[ix] =
      ox +
      Math.sin(
        t * 2.2 + oy * 3 + oz * 4
      ) * 0.08;
    paperPositions.array[ix + 1] =
      oy +
      Math.sin(
        t * 1.7 + ox * 2.5 + oz * 3
      ) * 0.06;
    paperPositions.array[ix + 2] =
      oz +
      Math.sin(
        t * 2.6 + ox * 3 + oy * 2
      ) * 0.08;
  }

  paperPositions.needsUpdate = true;
  paperCube.geometry.computeVertexNormals();

  // Luces patrulla A

  patrolA.red.intensity =
    Math.sin(t * 12) > 0
      ? 40
      : 2;

  patrolA.blue.intensity =
    Math.sin(t * 12) < 0
      ? 40
      : 2;

  // Luces patrulla B

  patrolB.red.intensity =
    Math.sin(
      t * 12 + 1
    ) > 0
      ? 40
      : 2;

  patrolB.blue.intensity =
    Math.sin(
      t * 12 + 1
    ) < 0
      ? 40
      : 2;

  // Movimiento policías

  officer1.rotation.y =
    Math.sin(t) * 0.4;

  officer2.rotation.y =
    -Math.sin(t) * 0.4;

  detective.rotation.y =
    Math.sin(
      t * 0.5
    ) * 0.8;

  // Movimiento cinta

  tape1.rotation.z =
    Math.sin(t * 3) * 0.03;

  tape2.rotation.z =
    Math.sin(
      t * 3 + 1
    ) * 0.03;

  // Lluvia

  for (
    let i = 0;
    i < rainCount;
    i++
  ) {

    rainPositions.array[
      i * 3 + 1
    ] -= 0.8;

    if (
      rainPositions.array[
        i * 3 + 1
      ] < 0
    ) {

      rainPositions.array[
        i * 3 + 1
      ] = 80;
    }
  }

  rainPositions.needsUpdate =
    true;

  controls.update();

  renderer.render(
    scene,
    camera
  );
}

animate();

// ==========================================
// RESPONSIVE
// ==========================================

window.addEventListener(
  "resize",
  () => {

    camera.aspect =
      window.innerWidth /
      window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
      window.innerWidth,
      window.innerHeight
    );
  }
);