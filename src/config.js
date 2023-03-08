window.COLOR = {
    "front": 0xFDF02A,
    "back": 0x0ED100,
    "right": 0xEA3135,
    "left": 0xFC8137,
    "up": 0x00A9F1,
    "down": 0xEEEEEE,
};
var cube;
var cubeWidth = 10;
var cubeCenter = [0, 0, 0];
var pWidthRatio = 0.85;
var pHeighRatio = 0.08 * 2;
var extraWidthRatio = 0.06;
var cubeBoxGap = cubeWidth * extraWidthRatio / 2;
var cubeSize = 3;
var fps = 50;//frames per second
var perRotationTime = 0.5; // second
var urlParams = new URLSearchParams(location.search);
if (urlParams.get("size")) {
    cubeSize = parseInt(urlParams.get("size"));
}
if (urlParams.get("speed")) {
    perRotationTime = 1 / parseInt(urlParams.get("speed"));
}
var TASK = {
    ROTATE_CUBE: 0,
    RESTORE_CUBE_GROUP: 1,
    MIX_UP_CUBE: 2
}
var unitBoxColor = 0x000000;
window.unitBoxMaterial = new THREE.MeshBasicMaterial({color: unitBoxColor});
window.unitBoxGeometry = new THREE.BoxGeometry(cubeWidth, cubeWidth, cubeWidth);
window.planeGeometry = new THREE.BufferGeometry();
window.dummyBoxGeometry = new THREE.BoxGeometry(1, 1, 1);
//prepare action queue
window.actionQueue;
window.availableCubeSize = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 20, 30, 40];
window.availableSpeed = [0.5, 1, 2, 3, 4, 5];

// actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": "x", "index": 0, "direction": "Cw"});
// actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": "y", "index": 1, "direction": "CCw"});

