// 导入所需模块
import {
  Scene,
  DirectionalLight,
  AmbientLight,
  BoxGeometry,
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
  // 1 添加直射光
  const directionalLight = new DirectionalLight(0xffffff);
  // 2 设置直射方向
  directionalLight.position.set(-1, 1, -1);
  // 3 添加环境光
  const ambientLight = new AmbientLight(0xffffff, 0.1);
  scene.add(directionalLight, ambientLight);
  // 添加建筑
  const boxGeometry = new BoxGeometry(1, 1, 1);
  boxGeometry.translate(0, 0.5, 0);
  // 4 使用高光材质
  const boxMaterial = new MeshPhongMaterial({ color: 0xc1c1c1 });
  const building = new Mesh(boxGeometry, boxMaterial);
  building.scale.set(0.5, 1, 0.5);
  building.rotation.set(0,Math.random()*Math.PI,0)
  scene.add(building);
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
