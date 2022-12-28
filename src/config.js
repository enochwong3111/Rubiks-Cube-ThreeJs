window.COLOR = {
    "front": 0x0ED100,
    "back": 0x00A9F1,
    "right": 0xEA3135,
    "left": 0xFDF02A,
    "up": 0xFC8137,
    "down": 0xEEEEEE,//0xDE2CE1
};

var cubeWidth = 10;
var cubeCenter = [0, 0, 0];
var pWidthRatio = 0.85;
var pHeighRatio = 0.08 * 2;
var extraWidthRatio = 0.06;
var cubeBoxGap = cubeWidth * extraWidthRatio / 2;
var cubeSize = 3;
var fps = 50;//frames per second
var perRotationTime = 0.5; // second
var TASK = {
    ROTATE_CUBE: 0,
    RESTORE_CUBE_GROUP: 1
}
var unitBoxColor = 0x000000;
window.unitBoxMaterial = new THREE.MeshBasicMaterial({color: unitBoxColor});
window.unitBoxGeometry = new THREE.BoxGeometry(cubeWidth, cubeWidth, cubeWidth);
window.planeGeometry = new THREE.BufferGeometry();
window.dummyBoxGeometry = new THREE.BoxGeometry(1, 1, 1);

// actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": "x", "index": 0, "direction": "Cw"});
// actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": "y", "index": 1, "direction": "CCw"});
