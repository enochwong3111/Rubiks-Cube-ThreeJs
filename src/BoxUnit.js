class BoxUnit {
    //props
    #group;

    constructor (id, width, scene) {
        this.id = id;
        this.width = width;
        this.#group = new THREE.Group();
        let box = new THREE.Mesh( unitBoxGeometry, unitBoxMaterial );
        this.#group.add(box);
        scene.add(this.#group);
    }

    addPlane (geometryPlane, materialPlane) {
        let plane = new THREE.Mesh(geometryPlane, materialPlane);
        this.#group.add(plane);
    }

    setPosition (x, y, z) {
        this.#group.position.set(x, y, z);
    }

    assignGroup (group) {
        group.add(this.#group);
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