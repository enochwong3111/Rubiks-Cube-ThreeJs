var rotateFn = {
    "back": rotate180,
    "right": rotateRight90,
    "left": rotateLeft90,
    "up": rotateUp90,
    "down": rotateDown90
};

function rotate180(x, y, z) {
    return [-x, -y, -z];
}

function rotateRight90(x, y, z) {
    return [z, y, -x];
}

function rotateLeft90(x, y, z) {
    return [-z, -y, x];
}

function rotateUp90(x, y, z) {
    return [x, z, -y];
}

function rotateDown90(x, y, z) {
    return [-x, -z, y];
}



function mixup(){
    var rotationTimes = 100;
    var rotationArray = [];//{"dir": "CCW/CW", "plane":"x/y/z", "index":"0-size"}
    var lastP = "";
    var lastPI = 0;
    for (var i = 0; i < rotationTimes; i++) {
        do {
            var tmpAct = getRandomAction();
            var plane = tmpAct.plane;
            var dir = tmpAct.dir;
            var pIndex = tmpAct.pIndex;
        } while(lastP === plane && lastPI === pIndex && lastDir != dir);
        lastP = plane;
        lastPI = pIndex;
        lastDir = dir;
        actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": plane, "index": pIndex, "direction": dir, "mixup":true});
        rotationArray.push(tmpAct);
    }
    return rotationArray;
}

function getRandomAction() {
    var planes = ["x", "y", "z"];
    var directions = ["Cw", "CCw"];
    var plane = planes[getRandomInt(3)];
    var dir = directions[getRandomInt(2)];
    var pIndex = getRandomInt(window.cubeSize);
    var objTmp = {
        "dir": dir,
        "plane": plane,
        "pIndex": pIndex
    };
    return objTmp;
}

function getRandomInt(max) {//exclude max
    return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}
