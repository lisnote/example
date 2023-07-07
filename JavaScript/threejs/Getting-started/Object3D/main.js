// 导入所需模块
import {
  Scene,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  WebGLRenderer,
} from 'three';

// 场景 ----------------------------------------------------------------------------------------------------
const scene = new Scene();
// 添加建筑
const boxGeometry = new BoxGeometry(1, 1, 1);
boxGeometry.translate(0, 0.5, 0);
const boxMaterial = new MeshBasicMaterial({ color: 0xc1c1c1 });
const building = new Mesh(boxGeometry, boxMaterial);
// 1 缩放对象宽度为原来的一半
building.scale.set(0.5, 1, 0.5);
// 2 随机旋转对象
building.rotation.set(0,Math.random()*Math.PI,0)
scene.add(building);
// 相机 ----------------------------------------------------------------------------------------------------
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
// 3 设置对象位置
camera.position.set(0, 2, 1.5);
// 4 设置对象指向
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
