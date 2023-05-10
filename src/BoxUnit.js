class BoxUnit {
    //props
    #group;

    constructor (id, width, scene) {
        this.id = id;
        this.width = width;
        this.#group = new THREE.Group();
        let box = new THREE.Mesh(unitBoxGeometry, unitBoxMaterial);
        box.userData.parentBox = this;
        box.userData.isBox = true;
        this.#group.add(box);
        scene.add(this.#group);
    }

    removeFromScene(scene) {
        for (var i = this.#group.children.length - 1; i >= 0; i--) {
            let child = this.#group.children[i];
            if (child.userData.isPlane){
                child.geometry.dispose();
                child.material.dispose();
            }
            this.#group.remove(child);
        }
        scene.remove(this.#group);
    }

    addPlane (geometryPlane, materialPlane, movableDirections) {
        let plane = new THREE.Mesh(geometryPlane, materialPlane);
        plane.userData = {
            "parentBox": this,
            "isPlane": true,
            "movableDirections": movableDirections
        };
        this.#group.add(plane);
    }

    setPosition(x, y, z) {
        this.#group.position.set(x, y, z);
    }

    getPosition() {
        return this.#group.position;
    }

    assignGroup(group) {
        group.add(this.#group);
    }

    updatePlaneMovableDirections(rotateDirection) {
        this.#group.children.forEach(function(object) {
            if (object.userData.isPlane) {
                let directions = object.userData.movableDirections;
                if (directions[rotateDirection]) {
                    let originDir = "[" + Object.keys(directions).sort().join('') + "]";
                    let antiDir = "xyz".replace(new RegExp(originDir,"g"), "");
                    object.userData.movableDirections = {};
                    object.userData.movableDirections[rotateDirection] = 1;
                    object.userData.movableDirections[antiDir] = 1;
                }
            }
        });
    }

    get currentRotation () {
        let rotation = this.#group.rotation;
        let rX = (rotation.x / Math.PI) % 2;
        let rY = (rotation.x / Math.PI) % 2;
        let rZ = (rotation.x / Math.PI) % 2;
        return {x: rX, y: rY, z: rZ};
    }

    getGroup() {
        return this.#group;
    }
}