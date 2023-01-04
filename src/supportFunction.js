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