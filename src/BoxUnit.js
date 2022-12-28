class BoxUnit {
    //props
    #group;

    constructor (id, width, scene, color=0x000000) {
        this.id = id;
        this.width = width;
        this.#group = new THREE.Group();
        let geometry = new THREE.BoxGeometry(width, width, width);
        let material = new THREE.MeshBasicMaterial({color: color});
        let box = new THREE.Mesh( geometry, material );
        this.#group.add(box);
        scene.add(this.#group);
    }

    addColorPlane (points, color) {
        let geometryPlane = new THREE.BufferGeometry();
        let verticesPlane = new Float32Array(points);

        geometryPlane.setAttribute('position', new THREE.BufferAttribute(verticesPlane, 3));

        let materialPlane = new THREE.MeshLambertMaterial({
            color: color,
            side: THREE.DoubleSide,
        });

        geometryPlane.computeVertexNormals(); //Important!!, fail to render the plane if no this
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