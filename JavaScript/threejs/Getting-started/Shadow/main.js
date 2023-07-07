// 导入所需模块
import {
  Scene,
  DirectionalLight,
  AmbientLight,
  BoxGeometry,
  PlaneGeometry,
  MeshPhongMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';

// 判断是否支持WebGL
if (WebGL.isWebGLAvailable()) {
  // 场景 ----------------------------------------------------------------------------------------------------
  const scene = new Scene();
  // 光源
  const directionalLight = new DirectionalLight(0xffffff);
  directionalLight.position.set(-1, 1, -1);
  // 1.1 设置光源投射阴影
  directionalLight.castShadow = true;
  // 1.2 设置光源阴影投射范围
  directionalLight.shadow.camera.left = -10;
  directionalLight.shadow.camera.right = 10;
  directionalLight.shadow.camera.near = -10;
  directionalLight.shadow.camera.far = 10;
  directionalLight.shadow.camera.bottom = -10;
  directionalLight.shadow.camera.top = 10;
  // 1.3 阴影精度
  directionalLight.shadow.mapSize.height = 1024 * 2;
  directionalLight.shadow.mapSize.width = 1024 * 2;
  const ambientLight = new AmbientLight(0xffffff, 0.1);
  scene.add(directionalLight, ambientLight);
  // 添加建筑
  const boxGeometry = new BoxGeometry(1, 1, 1);
  boxGeometry.translate(0, 0.5, 0);
  const boxMaterial = new MeshPhongMaterial({ color: 0xc1c1c1 });
  const building = new Mesh(boxGeometry, boxMaterial);
  building.scale.set(0.5, 1, 0.5);
  building.rotation.set(0,Math.random()*Math.PI,0)
  // 2.1 设置模型投射阴影
  building.castShadow = true;
  // 2.2 设置模型接收阴影投射
  building.receiveShadow = true;
  scene.add(building);
  // 2.3 添加地面
  const planeGeometry = new PlaneGeometry(10, 10);
  planeGeometry.rotateX((270 * Math.PI) / 180);
  const planeMaterial = new MeshPhongMaterial({ color: 0xffffff });
  const floorMat = new Mesh(planeGeometry, planeMaterial);
  // 2.4 设置地面接收阴影投射
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
  // 3.1 设置渲染器渲染阴影
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
