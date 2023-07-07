// 导入所需模块
import {
  Scene,
  DirectionalLight,
  AmbientLight,
  PlaneGeometry,
  MeshPhongMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
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
  // 1 创建模型加载器
  const loader = new GLTFLoader();
  // 2 加载模型
  loader.load(
    // 2.1 模型路径
    '/assets/Soldier.glb',
    // 2.2 加载成功回调函数
    (gltf) => {
      // 2.2.1 获取模型
      const model = gltf.scene;
      const character = gltf.scene.getObjectByName('Character');
      scene.add(model);
      // 模型阴影
      // 2.2.2 遍历角色模型及后代
      character.traverse((obj) => {
        // 2.2.3 如果模型后代是网格对象则设置光影
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
    },
    // 2.3 加载时回调函数, 常用于模型加载进度条
    (loding) => {
      console.log(
        '加载进度',
        ((loding.loaded / loding.total) * 100).toFixed(2),
      );
    },
    // 2.4 模型加载失败回调函数
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
  camera.lookAt(0, 1, 0);
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
