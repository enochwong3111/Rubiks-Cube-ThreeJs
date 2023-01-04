class ActionQueue {
    //
    //#state;//0: idle, 1: processing
    #pendingTasks;
    #processingTasks;

    constructor (id) {
        this.id = id;
        // this.#state = 0;
        this.#pendingTasks = [];
        this.#processingTasks = [];
    }

    register (task, data) {
        this.#pendingTasks.push({"type": task, "data": data});
    }

    preprocess (task) {
        let taskType = task.type;
        let data = task.data;
        switch (taskType) {
            case TASK.ROTATE_CUBE: 
                let cube = data.cube;
                let rotateAxis = data.axis;
                let direction = data.direction;
                cube.rotate(rotateAxis, data.index, direction);
                //fps, perRotationTime
                let framesNum = fps * perRotationTime;
                let factor = (direction === "Cw")?1:-1;
                if (rotateAxis === "y" || rotateAxis === "z") {
                    factor = -factor;
                }
                let finalRotatin = factor * Math.PI / 2;
                let rotateAngle = finalRotatin / framesNum;
                let curAngle = rotateAngle;
                for (let i = 2 ; i < framesNum; i++) {
                    curAngle += rotateAngle;
                    this.#processingTasks.push({"type": taskType, "axis": rotateAxis, "angle": curAngle, "cube": cube});
                }
                this.#processingTasks.push({"type": taskType, "axis": rotateAxis, "angle": finalRotatin, "cube": cube});
                this.#processingTasks.push({"type": TASK.RESTORE_CUBE_GROUP, "cube": cube});
                this.process({"type": taskType, "axis": rotateAxis, "angle": rotateAngle, "cube": cube});
                break;
            default: 
                break;
        }
    }

    process (task) {
        let taskType = task.type;
        let cube = task.cube;
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
            default: 
                break;
        }
    }

    processNext () {
        let task = this.#processingTasks.shift();
        if (task) {
            this.process(task)
            return;
        }
        task = this.#pendingTasks.shift();
        if (task) {
            this.preprocess(task);
            return;
        }
    }
}