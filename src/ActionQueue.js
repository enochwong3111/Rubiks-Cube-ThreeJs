class ActionQueue {
    //
    //#state;//0: idle, 1: processing
    #pendingTasks;
    #processingTasks;
    #instantTasks;

    constructor (id) {
        this.id = id;
        // this.#state = 0;
        this.#pendingTasks = [];
        this.#processingTasks = [];
        this.#instantTasks = [];
    }

    register (task, data) {
        if ([TASK.MIX_UP_CUBE, TASK.RESTORE_CUBE].indexOf(task) > -1) {
            this.#pendingTasks = [];
            this.#processingTasks = [];
            this.#instantTasks.push({"type": task, "data": data});
            return;
        }
        this.#pendingTasks.push({"type": task, "data": data});
    }

    preprocess (task) {
        let taskType = task.type;
        let data = task.data;
        let cube = data.cube;
        let rotateAxis = data.axis;
        let direction = data.direction;
        let framesNum = parseInt(fps * perRotationTime);
        let factor = (direction === "Cw")?1:-1;
        let isMixingup = data.mixup;
        if (rotateAxis === "y" || rotateAxis === "z") {
            factor = -factor;
        }
        switch (taskType) {
            case TASK.ROTATE_CUBE: 
                cube.constructRotationGroup(rotateAxis, data.index);
                cube.updateChildrenIndexAfterRotation(rotateAxis, data.index, direction);
                let finalRotatin = factor * Math.PI / 2;
                if (!isMixingup) {
                    let rotateAngle = finalRotatin / framesNum;
                    let curAngle = rotateAngle;
                    for (let i = 2 ; i < framesNum; i++) {
                        curAngle += rotateAngle;
                        this.#processingTasks.push({"type": taskType, "axis": rotateAxis, "angle": curAngle, "cube": cube});
                    }
                    this.#processingTasks.push({"type": taskType, "axis": rotateAxis, "angle": finalRotatin, "cube": cube});
                    this.#processingTasks.push({"type": TASK.RESTORE_CUBE_GROUP, "cube": cube});
                    this.process({"type": taskType, "axis": rotateAxis, "angle": rotateAngle, "cube": cube});
                }
                else {
                    this.process({"type": taskType, "axis": rotateAxis, "angle": finalRotatin, "cube": cube});
                    this.process({"type": TASK.RESTORE_CUBE_GROUP, "cube": cube});
                }
                break;
            default: 
                break;
        }
    }

    process (task) {
        let taskType = task.type;
        let scene = null;
        if (task.data && task.data.scene) {
            scene = task.data.scene;
        }
        switch (taskType) {
            case TASK.ROTATE_CUBE: 
                let rotateAxis = task.axis;
                let angle = task.angle;
                switch (rotateAxis) {
                    case "x":
                        cube.rotateGroup(angle, 0, 0);
                        break;
                    case "y":
                        cube.rotateGroup(0, angle, 0);
                        break;
                    case "z":
                        cube.rotateGroup(0, 0, angle);
                        break;
                }
                break;
            case TASK.RESTORE_CUBE_GROUP:
                cube.restoreChildList();
                break;
            case TASK.MIX_UP_CUBE:
                cube.removeFromScene(scene);
                cube = null;
                cube = new Cube(0, cubeSize, scene);
                mixup();
                break;
            case TASK.RESTORE_CUBE:
                cube.removeFromScene(scene);
                cube = null;
                cube = new Cube(0, cubeSize, scene);
                break;
            default: 
                break;
        }
    }

    processNext () {
        let task = this.#instantTasks.shift();
        if (task) {
            this.process(task)
            return;
        }
        task = this.#processingTasks.shift();
        if (task) {
            this.process(task)
            return;
        }
        task = this.#pendingTasks.shift();
        while (task && task.data.mixup) {
            this.preprocess(task);
            task = this.#pendingTasks.shift();
        }
        if (task) {
            this.preprocess(task);
            return;
        }
    }
}