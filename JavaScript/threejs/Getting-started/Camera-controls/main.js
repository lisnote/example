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
  Vector3,
} from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
  directionalLight.shadow.mapSize.height = 1024 * 2
  directionalLight.shadow.mapSize.width = 1024 * 2
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
      // 5 控制器事件绑定
      controls.addEventListener('change', () => {
        // 6 获取控制器平面角度
        character.rotation.set(1.5 * Math.PI, 0, controls.getAzimuthalAngle());
      });
      // 模型更新
      const clock = new Clock();
      function updateModel() {
        const deltaT = clock.getDelta();
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
  function updateRenderer() {
    requestAnimationFrame(updateRenderer);
    renderer.render(scene, camera);
  }
  updateRenderer();
  // 补充 ----------------------------------------------------------------------------------------------------
  // 自适应窗口大小变化
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  // 1 创建控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 2 设置控制器目标
  controls.target = new Vector3(0, 2, 0);
  // 3 关闭右键拖拽
  controls.enablePan = false;
  function updateControls() {
    requestAnimationFrame(updateControls);
    // 4 更新控制器
    controls.update();
  }
  updateControls();
} else {
  alert('您的浏览器不支持WebGL');
}
