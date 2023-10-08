// 导入所需模块
import {
  Scene,
  DirectionalLight,
  AmbientLight,
  PlaneGeometry,
  MeshPhongMaterial,
  Mesh,
  AnimationMixer,
  PerspectiveCamera,
  WebGLRenderer,
  Clock,
  Vector2,
  Vector3,
  Raycaster,
} from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
// 引入后处理扩展库EffectComposer.js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// 引入八叉树
import { Octree } from 'three/examples/jsm/math/Octree';
import { Capsule } from 'three/examples/jsm/math/Capsule';

// 判断是否支持WebGL
if (WebGL.isWebGLAvailable()) {
  // 场景 ----------------------------------------------------------------------------------------------------
  const scene = new Scene();
  // 光源
  const directionalLight = new DirectionalLight(0xffffff);
  directionalLight.position.set(-1, 1, -1);
  directionalLight.castShadow = true;
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.near = -10;
  directionalLight.shadow.camera.far = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.camera.top = 10;
  directionalLight.shadow.mapSize.height = 1024 * 2;
  directionalLight.shadow.mapSize.width = 1024 * 2;
  const ambientLight = new AmbientLight(0xffffff, 0.1);
  scene.add(directionalLight, ambientLight);
  // 导入模型
  const loader = new GLTFLoader();
  loader.load(
    '/assets/Soldier.glb',
    (gltf) => {
      const model = gltf.scene;
      const character = gltf.scene.getObjectByName('Character');
      scene.add(model);
      // 模型阴影
      character.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
      // 模型动画
      const mixer = new AnimationMixer(model);
      const clips = gltf.animations;
      const [idleClip, runClip] = clips;
      const idleAction = mixer.clipAction(idleClip),
        runAction = mixer.clipAction(runClip);
      const actions = { idle: idleAction, run: runAction };
      Object.values(actions).forEach((action) => action.play());
      runAction.setEffectiveWeight(0);
      // 动画切换
      let isRunning = false;
      window.addEventListener('mousedown', (event) => {
        if (event.button == 0) {
          isRunning = true;
        }
      });
      window.addEventListener('mouseup', (event) => {
        if (event.button == 0) {
          isRunning = false;
        }
      });
      // 模型方向对齐相机
      controls.addEventListener('change', () => {
        character.rotation.set(1.5 * Math.PI, 0, controls.getAzimuthalAngle());
      });
      // 地面判断
      let playerOnFloor = false;
      // 模型更新
      const clock = new Clock();
      function updateModel() {
        const deltaT = clock.getDelta();
        // 重力影响
        if (!playerOnFloor) {
          model.position.y -= deltaT;
          controls.target.y -= deltaT;
          camera.position.y -= deltaT;
        }
        const colliderRadius = 0.35;
        const colliderX = model.position.x;
        const colliderY = model.position.y;
        const colliderZ = model.position.z;
        // 2. 碰撞计算
        const result = worldOctree.capsuleIntersect(
          new Capsule(
            { x: colliderX, y: colliderY + colliderRadius, z: colliderZ },
            { x: colliderX, y: colliderY - colliderRadius + 1.9, z: colliderZ },
            colliderRadius,
          ),
        );
        playerOnFloor = false;
        if (result) {
          playerOnFloor = result.normal.y > 0;
          const translateY = result.normal.multiplyScalar(result.depth).y;
          model.position.y += translateY;
          camera.position.y += translateY;
        }
        if (model.position.y < -2) {
          model.position.y = 2;
          camera.position.y = 4;
        }
        // 动作切换
        mixer.update(deltaT);
        const idleWeight = actions?.idle.weight;
        const runWeight = actions?.run.weight;
        if (idleWeight < 1 && !isRunning) {
          actions.run.setEffectiveWeight(runWeight - deltaT * 3);
          actions.idle.setEffectiveWeight(idleWeight + deltaT * 3);
        }
        if (runWeight < 1 && isRunning) {
          actions.run.setEffectiveWeight(runWeight + deltaT * 2);
          actions.idle.setEffectiveWeight(idleWeight - deltaT * 2);
        }
        // 坐标移动
        if (isRunning) {
          const runSpeedRate = 8;
          // 1. 获取相机角度
          const angle = controls.getAzimuthalAngle();
          // 2. 改变模型和相机坐标
          model.position.x -= Math.sin(angle) * deltaT * runSpeedRate;
          model.position.z -= Math.cos(angle) * deltaT * runSpeedRate;
          camera.position.x -= Math.sin(angle) * deltaT * runSpeedRate;
          camera.position.z -= Math.cos(angle) * deltaT * runSpeedRate;
        }
        // 重置相机指向
        controls.target = new Vector3(
          model.position.x,
          model.position.y + 2,
          model.position.z,
        );
        requestAnimationFrame(updateModel);
      }
      updateModel();
    },
    (loding) => {
      console.log(
        '加载进度',
        ((loding.loaded / loding.total) * 100).toFixed(2),
      );
    },
    console.error,
  );
  // 添加地面
  const planeGeometry = new PlaneGeometry(10, 10);
  planeGeometry.rotateX((270 * Math.PI) / 180);
  const planeMaterial = new MeshPhongMaterial({ color: 0xffffff });
  const floorMat = new Mesh(planeGeometry, planeMaterial);
  floorMat.receiveShadow = true;
  scene.add(floorMat);
  // 1. 构建八叉树
  const worldOctree = new Octree();
  worldOctree.fromGraphNode(floorMat);
  // 相机 ----------------------------------------------------------------------------------------------------
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000,
  );
  camera.position.set(0, 2, 1.5);
  // 渲染器 ----------------------------------------------------------------------------------------------------
  const renderer = new WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 后处理
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  // 创建OutlinePass通道
  const v2 = new Vector2(window.innerWidth, window.innerWidth);
  const outlinePass = new OutlinePass(v2, scene, camera);
  outlinePass.visibleEdgeColor.set(0x00ff00);
  outlinePass.edgeThickness = 4;
  outlinePass.edgeStrength = 6;
  composer.addPass(outlinePass);
  function updateRenderer() {
    composer.render();
    requestAnimationFrame(updateRenderer);
  }
  updateRenderer();
  // 补充 ----------------------------------------------------------------------------------------------------
  // 自适应窗口大小变化
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  // 创建控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target = new Vector3(0, 2, 0);
  controls.enablePan = false;
  function updateControls() {
    requestAnimationFrame(updateControls);
    controls.update();
  }
  updateControls();
  // 鼠标右键点击时窗口中心点选中对象变色
  const raycaster = new Raycaster();
  window.addEventListener('mousedown', (event) => {
    if (event.button != 2) return;
    raycaster.setFromCamera({ x: 0, y: 0 }, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects[0]) {
      outlinePass.selectedObjects = [intersects[0].object];
    }
  });
} else {
  alert('您的浏览器不支持WebGL');
}
