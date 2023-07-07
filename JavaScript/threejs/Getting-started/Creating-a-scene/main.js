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
// 1 创建场景scene
const scene = new Scene();
// 1.1 创建一个几何图形geometry,宽度为1,高度为1,深度为1
const boxGeometry = new BoxGeometry(1, 1, 1);
// 1.2 设置该几何图形的y轴中心点到底部
boxGeometry.translate(0, 0.5, 0);
// 1.3 创建一种基础材料material,颜色为c1c1c1
const boxMaterial = new MeshBasicMaterial({ color: 0xc1c1c1 });
// 1.4 创建一个物体building,形状为boxGeometry, 材料为boxMaterial
const building = new Mesh(boxGeometry, boxMaterial);
// 1.5 将物体building添加到场景scene中
scene.add(building);
// 相机 ----------------------------------------------------------------------------------------------------
// 2 创建相机camera, 视野角度75,宽高为网页的宽高, 近截面0.1, 远截面2000
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  2000,
);
// 2.1 设置相机坐标
camera.position.set(0, 2, 1.5);
// 2.2 设置相机方向
camera.lookAt(0, 1, 0);
// 渲染器 ----------------------------------------------------------------------------------------------------
// 3 创建渲染器renderer
const renderer = new WebGLRenderer();
// 3.1 设置渲染器宽高为网页宽高
renderer.setSize(window.innerWidth, window.innerHeight);
// 3.2 添加渲染器到网页
document.body.appendChild(renderer.domElement);
// 3.3 开始渲染场景
function updateRenderer() {
  // 设置浏览器下次重绘前重新执行函数
  requestAnimationFrame(updateRenderer);
  // 渲染场景
  renderer.render(scene, camera);
}
updateRenderer();
