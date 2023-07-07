// 导入所需模块
import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three';
import WebGL from 'three/examples/jsm/capabilities/WebGL';

// 判断是否支持WebGL
if (WebGL.isWebGLAvailable()) {
  // 场景 ----------------------------------------------------------------------------------------------------
  const scene = new Scene();
  // 添加建筑
  const boxGeometry = new BoxGeometry(1, 1, 1);
  boxGeometry.translate(0, 0.5, 0);
  const boxMaterial = new MeshBasicMaterial({ color: 0xc1c1c1 });
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
  // 1 添加窗口变化监听
  window.addEventListener('resize', () => {
    // 2 更新相机截面宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 3 更新相机投影矩阵
    camera.updateProjectionMatrix();
    // 4 更新渲染画布尺寸
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
} else {
  alert('您的浏览器不支持WebGL');
}
