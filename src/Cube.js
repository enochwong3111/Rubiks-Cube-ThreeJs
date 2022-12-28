class Cube {
    //Props
    #group;
    #childrenIndex = [];
    #children = [];
    #rotateOperator = {};
    #postiveXPlanes = [];
    #negtiveXPlanes = [];
    #postiveYPlanes = [];
    #negtiveYPlanes = [];
    #postiveZPlanes = [];
    #negtiveZPlanes = [];
    #boxFrontPlanePoints = [];
    #boxBackPlanePoints = [];
    #boxRightPlanePoints = [];
    #boxLeftPlanePoints = [];
    #boxUpPlanePoints = [];
    #boxDownPlanePoints = [];
    #rotateGroup;
    
    constructor (id, size, scene, color=0x000000) {
        this.id = id;
        this.size = size;
        this.#group = new THREE.Group();
        this.#rotateGroup = new THREE.Group();
        let sizeCube = size ** 3;
        let emptyBoxes = this.getEmptyBoxes();
        for(let i = 0; i < sizeCube; i++) {
            this.#childrenIndex.push(i);
            if (!emptyBoxes[i]) {
                let box = new BoxUnit(i, cubeWidth, this.#group);//scene
                this.#children.push(box);
            } else {
                this.#children.push(null);
            }
        }
        scene.add(this.#group);
        scene.add(this.#rotateGroup);
        this.constructRotateOperator();
        this.constructPlaneIndex();
        this.constructPlanePoints ()
        let _this = this;
        this.#postiveXPlanes.forEach(function(i) {
            _this.#children[i].addColorPlane(_this.#boxRightPlanePoints, COLOR["right"]);
        });
        this.#negtiveXPlanes.forEach(function(i) {
            _this.#children[i].addColorPlane(_this.#boxLeftPlanePoints, COLOR["left"]);
        });
        this.#postiveYPlanes.forEach(function(i) {
            _this.#children[i].addColorPlane(_this.#boxUpPlanePoints, COLOR["up"]);
        });
        this.#negtiveYPlanes.forEach(function(i) {
            _this.#children[i].addColorPlane(_this.#boxDownPlanePoints, COLOR["down"]);
        });
        this.#postiveZPlanes.forEach(function(i) {
            _this.#children[i].addColorPlane(_this.#boxFrontPlanePoints, COLOR["front"]);
        });
        this.#negtiveZPlanes.forEach(function(i) {
            _this.#children[i].addColorPlane(_this.#boxBackPlanePoints, COLOR["back"]);
        });
        let index = 0;
        for(let y = 0; y < size; y++) {
            for(let z = 0; z < size; z++) {
                for(let x = 0; x < size; x++) {
                    if (!emptyBoxes[index]) {
                        this.setBoxUnitPosition(index, x, y, z);
                    }
                    index++;
                }
            }
        }
    }

    //get empty boxes
    getEmptyBoxes() {
        let s = this.size;
        let sizeMinus1 = s - 1;
        let result = {};
        for (let y = 1; y < sizeMinus1; y++) {
            let yS = s * s * y;
            for (let z = 1; z < sizeMinus1; z++) {
                let zS = z * s;
                for (let x = 1; x < sizeMinus1; x++) {
                    let key = x + zS + yS;
                    result[key] = 1;
                }
            }
        }
        return result;
    }

    //get plane points
    constructPlanePoints () {
        let outer_z = cubeWidth * (1 + pHeighRatio) / 2;
        let inner_z = cubeWidth / 2;
        let inner_x = cubeWidth * pWidthRatio / 2;
        let inner_y = inner_x;
        let outer_x = cubeWidth * (pWidthRatio + extraWidthRatio) / 2;
        let outer_y = outer_x;
        let points = [
            //1st(front) down right
            -inner_x, -inner_y, outer_z,
            inner_x, -inner_y, outer_z,
            inner_x, inner_y, outer_z,

            //1st up left
            inner_x, inner_y, outer_z,
            -inner_x, inner_y, outer_z,
            -inner_x, -inner_y, outer_z,

            //2nd(right) down right
            inner_x, inner_y, outer_z,
            inner_x, -inner_y, outer_z,
            outer_x, -outer_y, inner_z,

            //2nd up left
            outer_x, -outer_y, inner_z,
            outer_x, outer_y, inner_z,
            inner_x, inner_y, outer_z,

            //3rd(up) up
            inner_x, inner_y, outer_z,
            -outer_x, outer_y, inner_z,
            -inner_x, inner_y, outer_z,

            //3rd down
            outer_x, outer_y, inner_z,
            -outer_x, outer_y, inner_z,
            inner_x, inner_y, outer_z,
            
            //4th(left) down right
            -inner_x, -inner_y, outer_z,
            -inner_x, inner_y, outer_z,
            -outer_x, -outer_y, inner_z,

            //4th up left
            -outer_x, outer_y, inner_z,
            -outer_x, -outer_y, inner_z,
            -inner_x, inner_y, outer_z,

            //5th(down) up
            -outer_x, -outer_y, inner_z,
            inner_x, -inner_y, outer_z,
            -inner_x, -inner_y, outer_z,
    
            //5th down
            -outer_x, -outer_y, inner_z,
            outer_x, -outer_y, inner_z,
            inner_x, -inner_y, outer_z
        ];

        let planes = {};
        planes["front"] = points;
        var arrSize = points.length;
        var directions = ["back", "right", "left", "up", "down"];

        directions.forEach(function(direction){
            planes[direction] = [];
        });

        for (let i = 0; i < arrSize; i+=3) {
            let x_tmp = points[i], y_tmp = points[i + 1], z_tmp = points[i + 2];
            directions.forEach(function(direction){
                planes[direction] = planes[direction].concat(rotateFn[direction](x_tmp, y_tmp, z_tmp));
            });
        }

        this.#boxFrontPlanePoints = points;
        this.#boxBackPlanePoints = planes.back;
        this.#boxRightPlanePoints = planes.right;
        this.#boxLeftPlanePoints = planes.left;
        this.#boxUpPlanePoints = planes.up;
        this.#boxDownPlanePoints = planes.down;
    }

    constructPlaneIndex () {
        /*
        get boxes' index for 6 directions
            y+: 0 to x^2-1
            y-: x^2*(x-1) to x^3-1
            x+: (1 to x^2) * x -1
            x-: (0 to x^2 -1) * x
            z+: 0, 1, 2, 9, 10, 11, 18, 19, 20 => (0 to x-1)*x^2 + y[0 to x-1]
            z-: 6, 7, 8, 15, 16, 17, 24, 25, 26 => a=(1 to x), (ax-1)x + y[0 to x-1] = ax^2 - x + y
        */  
        //function scope variables
        let size = this.size;
        let sizeSquare = size ** 2;
        for (let y = 0; y < sizeSquare; y++) {
            this.#postiveYPlanes.push(y);
            let negX = y * size;
            this.#negtiveXPlanes.push(negX);
            this.#postiveXPlanes.push(negX + size - 1);
        }
    
        let negYRangeMin = sizeSquare * (size - 1), negYRangeMax = sizeSquare * size;
        for (let y = negYRangeMin; y < negYRangeMax; y++) {
            this.#negtiveYPlanes.push(y);
        }
    
        let sizeMinus1 = size - 1;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let posZ = x * sizeSquare + y;
                this.#postiveZPlanes.push(posZ);
                this.#negtiveZPlanes.push(posZ + sizeSquare - size);// (x+1) * sizeSquare -size + y = posZ + sizeSquare - size 
            }
        }
        /* //object variable
        var this.#postiveXPlanes = {}, this.#negtiveXPlanes = {}, this.#postiveYPlanes = {}, this.#negtiveYPlanes = {}, this.#postiveZPlanes = {}, this.#negtiveZPlanes = {};
        let sizeSquare = size ** 2;
        for (let y = 0; y < sizeSquare; y++) {
            this.#postiveYPlanes[y] = 1;
            let negX = y * size;
            this.#negtiveXPlanes[negX] = 1; 
            this.#postiveXPlanes[negX + size - 1] = 1;
        }
    
        let negYRangeMin = sizeSquare * (size - 1), negYRangeMax = sizeSquare * size;
        for (let y = negYRangeMin; y < negYRangeMax; y++) {
            this.#negtiveYPlanes[y] = 1;
        }
    
        let sizeMinus1 = size - 1;
        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                let posZ = x * sizeSquare + y;
                this.#postiveZPlanes[posZ] = 1;
                this.#negtiveZPlanes[posZ + sizeSquare - size] = 1;// (x+1) * sizeSquare -size + y = posZ + sizeSquare - size 
            }
        }*/
        // console.log("this.#postiveXPlanes");
        // console.log(this.#postiveXPlanes);
        // console.log("this.#negtiveXPlanes");
        // console.log(this.#negtiveXPlanes);
        // console.log("this.#postiveYPlanes");
        // console.log(this.#postiveYPlanes);
        // console.log("this.#negtiveYPlanes");
        // console.log(this.#negtiveYPlanes);
        // console.log("this.#postiveZPlanes");
        // console.log(this.#postiveZPlanes);
        // console.log("this.#negtiveZPlanes");
        // console.log(this.#negtiveZPlanes);
    }

    //get position
    setBoxUnitPosition (index, x, y, z) {
        let s = this.size;
        let m = s / 2;
        m -= 0.5;
        let d = cubeWidth + cubeBoxGap;
        let bX = (x - m) * d;
        let bY = (m - y) * d;
        let bZ = (m - z) * d;
        this.#children[index].setPosition(bX, bY, bZ);
    }

    /*
    //get rotate operator
    constructRotateOperator_old () {
        let s = this.size;
        // let sizeSqure = s ** 2;

        this.#rotateOperator = {
            "x" : {
                "Cw": [],
                "CCw": [],
                "base": []
            },
            "y" : {
                "Cw": [],
                "CCw": [],
                "base": []
            },
            "z" : {
                "Cw": [],
                "CCw": [],
                "base": []
            }
        };

        //construct Y clockwise(Cw)
        for (let y = 0; y < s; y++) {
            let operator = [];
            let base = [];
            for (let z = 0; z < s; z++) {
                for (let x = 0; x < s; x++) {
                    let oIndex = (y * s + 1 + x) * s - 1 - z; // = y * sizeSqure + s - 1 - z + x * s;
                    let bIndex = x + s *(z + s * y); // = x + s * z + s ** 2 * y
                    operator.push(oIndex);
                    base.push(bIndex);
                }
            }
            this.#rotateOperator.y.Cw.push(operator);
            this.#rotateOperator.y.base.push(base);
        }

        //construct Y counter clockwise(CCw)
        for (let y = 0; y < s; y++) {
            let operator = [];
            for (let z = 0; z < s; z++) {
                for (let x = 0; x < s; x++) {
                    let index = (y * s + s - 1 - x) * s + z; //  = y * sizeSqure + (s - 1) * s + z - x * s;
                    operator.push(index);
                }
            }
            this.#rotateOperator.y.CCw.push(operator);
        }

        //construct X clockwise(Cw)
        for (let x = 0; x < s; x++) {
            let operator = [];
            let base = [];
            for (let y = 0; y < s; y++) {
                for (let z = 0; z < s; z++) {
                    // let index = (s - y - 1) * s + z * sizeSqure + x;
                    let index = (s - y - 1 + z * s) * s + x;
                    let bIndex = x + s *(z + s * y);
                    operator.push(index);
                    base.push(bIndex);
                }
            }
            this.#rotateOperator.x.Cw.push(operator);
            this.#rotateOperator.x.base.push(base);
        }
        //construct X counter clockwise(CCw)
        for (let x = 0; x < s; x++) {
            let operator = [];
            for (let y = 0; y < s; y++) {
                for (let z = 0; z < s; z++) {
                    // let index = s * ((s - 1) * s + y) - z * sizeSqure + x;
                    let index = s * ((s - 1 - z) * s + y) + x;
                    operator.push(index);
                }
            }
            this.#rotateOperator.x.CCw.push(operator);
        }

        //construct Z clockwise(Cw)
        for (let z = 0; z < s; z++) {
            let operator = [];
            let base = [];
            for (let y = 0; y < s; y++) {
                for (let x = 0; x < s; x++) {
                    // let index = (s - 1) * sizeSqure + s * z + y - sizeSqure * x;
                    let index = ((s - x - 1) * s + z) * s + y;
                    let bIndex = x + s *(z + s * y);
                    operator.push(index);
                    base.push(bIndex);
                }
            }
            this.#rotateOperator.z.Cw.push(operator);
            this.#rotateOperator.z.base.push(base);
        }
        //construct Z counter clockwise(CCw)
        for (let z = 0; z < s; z++) {
            let operator = [];
            for (let y = 0; y < s; y++) {
                for (let x = 0; x < s; x++) {
                    // let index = sizeSqure * x + s - 1 + s * z - y;
                    let index = (x * s + z + 1) * s - y - 1;
                    operator.push(index);
                }
            }
            this.#rotateOperator.z.CCw.push(operator);
        }
    }*/

    //get rotate operator
    constructRotateOperator () {
        let s = this.size;
        let baseOperatorTmp = {};
        let cube = this;
        // let sizeSqure = s ** 2;

        this.#rotateOperator = {
            "x" : {
                "Cw": [],
                "CCw": [],
                "base": []
            },
            "y" : {
                "Cw": [],
                "CCw": [],
                "base": []
            },
            "z" : {
                "Cw": [],
                "CCw": [],
                "base": []
            }
        };

        let sizeMinus1 = s - 1;

        function getBaseOperator(x, y, z) {
            var key = [x, y, z].join();
            if (baseOperatorTmp[key]) {
                return baseOperatorTmp[key];
            }
            // x + s * z + s ** 2 * y
            let v = x + s *(z + s * y);
            baseOperatorTmp[key] = v
            return v;
        }

        function getYCwOperator(x, y, z) {
            // y * sizeSqure + s - 1 - z + x * s;
            return (y * s + 1 + x) * s - 1 - z;
        }
        function getYCCwOperator(x, y, z) {
            // y * sizeSqure + (s - 1) * s + z - x * s;
            return (y * s + sizeMinus1 - x) * s + z;
        }

        function getXCwOperator(x, y, z) {
            // (s - y - 1) * s + z * sizeSqure + x;
            return (sizeMinus1 - y + z * s) * s + x;
        }
        function getXCCwOperator(x, y, z) {
            // s * ((s - 1) * s + y) - z * sizeSqure + x;
            return s * ((sizeMinus1 - z) * s + y) + x;
        }

        function getZCwOperator(x, y, z) {
            // (s - 1) * sizeSqure + s * z + y - sizeSqure * x
            return ((sizeMinus1 - x) * s + z) * s + y;
        }
        function getZCCwOperator(x, y, z) {
            // sizeSqure * x + s - 1 + s * z - y
            return (x * s + z + 1) * s - y - 1;
        }

        //construct Y clockwise(Cw) and counter clockwise(CCw)
        [0, sizeMinus1].forEach(function(y){
            let base = [];
            let operatorCw = [];
            let operatorCCw = [];
            for (let z = 0; z < s; z++) {
                for (let x = 0; x < s; x++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getYCwOperator(x, y, z);
                    let CCwOIndex = getYCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            }
            cube.#rotateOperator.y.base[y] = base;
            cube.#rotateOperator.y.Cw[y] = operatorCw;
            cube.#rotateOperator.y.CCw[y] = operatorCCw;
        });

        for (let y = 1; y < sizeMinus1; y++) {
            let base = [];
            let operatorCw = [];
            let operatorCCw = [];
            [0, sizeMinus1].forEach(function(z){
                for (let x = 1; x < sizeMinus1; x++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getYCwOperator(x, y, z);
                    let CCwOIndex = getYCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            });
            [0, sizeMinus1].forEach(function(x){
                for (let z = 0; z < s; z++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getYCwOperator(x, y, z);
                    let CCwOIndex = getYCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            });
            cube.#rotateOperator.y.base[y] = base;
            cube.#rotateOperator.y.Cw[y] = operatorCw;
            cube.#rotateOperator.y.CCw[y] = operatorCCw;
        }

        //construct X clockwise(Cw) and counter clockwise(CCw)
        [0, sizeMinus1].forEach(function(x){
            let base = [];
            let operatorCw = [];
            let operatorCCw = [];
            for (let y = 0; y < s; y++) {
                for (let z = 0; z < s; z++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getXCwOperator(x, y, z);
                    let CCwOIndex = getXCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            }
            cube.#rotateOperator.x.base[x] = base;
            cube.#rotateOperator.x.Cw[x] = operatorCw;
            cube.#rotateOperator.x.CCw[x] = operatorCCw;
        });

        for (let x = 1; x < sizeMinus1; x++) {
            let base = [];
            let operatorCw = [];
            let operatorCCw = [];
            [0, sizeMinus1].forEach(function(z){
                for (let y = 1; y < sizeMinus1; y++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getXCwOperator(x, y, z);
                    let CCwOIndex = getXCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            });
            [0, sizeMinus1].forEach(function(y){
                for (let z = 0; z < s; z++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getXCwOperator(x, y, z);
                    let CCwOIndex = getXCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            });
            cube.#rotateOperator.x.base[x] = base;
            cube.#rotateOperator.x.Cw[x] = operatorCw;
            cube.#rotateOperator.x.CCw[x] = operatorCCw;
        }

        //construct Z clockwise(Cw)
        [0, sizeMinus1].forEach(function(z){
            let base = [];
            let operatorCw = [];
            let operatorCCw = [];
            for (let y = 0; y < s; y++) {
                for (let x = 0; x < s; x++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getZCwOperator(x, y, z);
                    let CCwOIndex = getZCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            }
            cube.#rotateOperator.z.base[z] = base;
            cube.#rotateOperator.z.Cw[z] = operatorCw;
            cube.#rotateOperator.z.CCw[z] = operatorCCw;
        });

        for (let z = 1; z < sizeMinus1; z++) {
            let base = [];
            let operatorCw = [];
            let operatorCCw = [];
            [0, sizeMinus1].forEach(function(x){
                for (let y = 1; y < sizeMinus1; y++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getZCwOperator(x, y, z);
                    let CCwOIndex = getZCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            });
            [0, sizeMinus1].forEach(function(y){
                for (let x = 0; x < s; x++) {
                    let bIndex = getBaseOperator(x, y, z);
                    let CwOIndex = getZCwOperator(x, y, z);
                    let CCwOIndex = getZCCwOperator(x, y, z);
                    base.push(bIndex);
                    operatorCw.push(CwOIndex);
                    operatorCCw.push(CCwOIndex);
                }
            });
            cube.#rotateOperator.z.base[z] = base;
            cube.#rotateOperator.z.Cw[z] = operatorCw;
            cube.#rotateOperator.z.CCw[z] = operatorCCw;
        }
    }

    //rotate fucntion
    rotate (axis, index, direction) {
        let cube = this;
        // console.log("origin: " + cube.#childrenIndex.join());
        let operators = this.#rotateOperator[axis];
        // console.log(JSON.stringify(this.#rotateOperator));
        let originalPosition = operators.base[index];
        let rotateOperator = operators[direction][index];
        let rotateGroup = this.#rotateGroup;
        // console.log(rotateGroup);
        originalPosition.forEach(function(index) {
            cube.#children[cube.#childrenIndex[index]].assignGroup(rotateGroup);
        });
        let originalSeq = cube.#childrenIndex.concat();
        // console.log('originalSeq: ' + originalSeq.join());
        originalPosition.forEach(function(indexOri, curIndex) {
            cube.#childrenIndex[indexOri] = originalSeq[rotateOperator[curIndex]];
        });
        // console.log('newSeq: ' + cube.#childrenIndex.join());
        // console.log("cur: " + cube.#childrenIndex.join());
        // console.log(this.#group.children);
    }

    //restore main group children list
    restoreChildList () {
        let cube = this;
        let rotateGroupChildren = this.#rotateGroup.children.concat();
        rotateGroupChildren.forEach(function(child) {
            let worldPosition = new THREE.Vector3();
            let quaternion = new THREE.Quaternion()
            child.getWorldPosition(worldPosition);
            child.getWorldQuaternion(quaternion);
            child.position.copy(worldPosition);
            child.rotation.setFromQuaternion(quaternion);
            cube.#group.add(child);
        });
        // console.log(cube.#group.children);
        // console.log(cube.#rotateGroup.children);
        cube.#group.parent.remove(cube.#rotateGroup);
        cube.#rotateGroup = new THREE.Group();
        cube.#group.parent.add(cube.#rotateGroup);
    }

    rotateGroup (x, y, z) {
        this.#rotateGroup.rotation.set(x, y, z);
    }

    getChildren () {
        return this.#children;
    }
}