import * as BABYLON from 'babylonjs';
import * as ZapparBabylon from '@zappar/zappar-babylonjs'; //библеотеки
import 'babylonjs-loaders';
import './styles.sass'; //стили
import texture1 from "../images/1.png" //текстуры масок
import texture2 from "../images/2.png"
import texture3 from "../images/3.png"
import texture4 from "../images/4.png"

//для удобства все импорты в одном месте
const canvas = document.createElement('canvas');
const eng = new BABYLON.Engine(canvas, true);
if (ZapparBabylon.browserIncompatible()) {
  ZapparBabylon.browserIncompatibleUI();
  throw new Error('бразузер не поддерживается');
}
//создаем AR сцену
export const scene = new BABYLON.Scene(eng);
let next = document.getElementById("dalee")
let previous = document.getElementById("nazad")
document.body.appendChild(canvas);
const light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);
export const cum = new ZapparBabylon.Camera('ZapparCamera', scene); //создаем камеру в переменную
ZapparBabylon.permissionRequestUI().then((granted) => {if (granted) {cum.start(true)}else {ZapparBabylon.permissionDeniedUI()};}); //запрос на  валидность браузера
//объявляем трекер лица человека
const faceTracker = new ZapparBabylon.FaceTrackerLoader().load();
const trackerTransformNode = new ZapparBabylon.FaceTrackerTransformNode('tracker', cum, faceTracker, scene);
trackerTransformNode.setEnabled(false);
faceTracker.onVisible.bind(() => {trackerTransformNode.setEnabled(true);});
faceTracker.onNotVisible.bind(() => {trackerTransformNode.setEnabled(false);});
const mat = new BABYLON.StandardMaterial('mat', scene);
mat.diffuseTexture = new BABYLON.Texture(texture1, scene);
let b = 0
let textures = [ texture1, texture2, texture3, texture4]
//функционал кнопок
document.addEventListener("DOMContentLoaded", () => {
  if (next != null){
    next.onclick = function(){
      if (b < textures.length-1){b+=1}else{b = 0}
      mat.diffuseTexture = new BABYLON.Texture(textures[b], scene);
}}});
document.addEventListener("DOMContentLoaded", ()=>{
  if (previous != null){
    previous.onclick = function(){
    if (b > 0){b-=1}else{b = textures.length-1}
    mat.diffuseTexture = new BABYLON.Texture(textures[b], scene);
}}})
window.addEventListener('resize', () => {
  eng.resize();
});
//создаем плоскость
const MeahFace = new ZapparBabylon.FaceMeshGeometry('mesh', scene);
MeahFace.parent = trackerTransformNode;
MeahFace.material = mat; 
//делаем бесконечный цикл приложения
eng.runRenderLoop(() => {
  MeahFace.updateFromFaceTracker(faceTracker);
  cum.updateFrame(); //делаем апдейт кадра
  scene.render(); //рендерим сцену 
});