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
} from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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
      // 模型更新
      // 1 创建时钟
      const clock = new Clock();
      function updateModel() {
        // 2 获取距离上次读取时钟的时间差
        const deltaT = clock.getDelta();
        // 3 使用时间差更新动画
        mixer.update(deltaT);
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
} else {
  alert('您的浏览器不支持WebGL');
}
