function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const clickStartP = new THREE.Vector3();
    var curIntersectPlane;
    var mouseMoved = false;
    // const near = 10;
    // const far = 100;
    // scene.fog = new THREE.Fog(0x141819, near, far);
    // scene.fog = new THREE.FogExp2(0x141819, 0.03);

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    scene.background = new THREE.Color( 0xD2D2D2);

    cube = new Cube(0, cubeSize, scene);

    // LIGHTS
    scene.add(new THREE.HemisphereLight(0xaaaaaa, 0x333333));

    var keyLight = new THREE.PointLight(0xaaaaaa);
    keyLight.position.x = 150;
    keyLight.position.y = -100;
    keyLight.position.z = 350;
    scene.add(keyLight);

    var rimLight = new THREE.PointLight(0x888888);
    rimLight.position.x = 100;
    rimLight.position.y = 100;
    rimLight.position.z = -500;
    scene.add(rimLight);

    // var rimLight2 = new THREE.PointLight(0x888888);
    // rimLight2.position.x = -100;
    // rimLight2.position.y = -100;
    // rimLight2.position.z = -100;
    // scene.add(rimLight2);

    const orbitControls = new THREE.OrbitControls( camera, renderer.domElement );

    //prepare action queue
    actionQueue = new ActionQueue(0);
    
    camera.position.set(cubeWidth * cubeSize, cubeWidth * cubeSize, cubeWidth * cubeSize);
    orbitControls.update();
    window.addEventListener('resize', onWindowResize);

    const mouseHelper = new THREE.Mesh(new THREE.BoxGeometry( 1, 1, 10 ), new THREE.MeshNormalMaterial());
    mouseHelper.visible = false;
    scene.add(mouseHelper);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    const geometry = new THREE.BufferGeometry();
    geometry.setFromPoints( [ new THREE.Vector3(), new THREE.Vector3() ] );

    const line = new THREE.Line( geometry, new THREE.LineBasicMaterial() );
    scene.add( line );

    animate();
    renderer.domElement.addEventListener('touchstart', onTouchStart);
    renderer.domElement.addEventListener('touchend', onTouchEnd);
    renderer.domElement.addEventListener('touchmove', onTounchMove);

    initPanel();
    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
        actionQueue.processNext();
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function onPointerMove(event) {
        event.preventDefault();
        if (event.buttons === 1 && !orbitControls.enabled && curIntersectPlane) {
            //with box clicked
            // console.log(curIntersectPlane);
            mouseMoved = true;
            /*
            mouse.x = getMousePositionX(event.clientX);
            mouse.y = getMousePositionY(event.clientY);
            raycaster.setFromCamera(mouse, camera);
            let dx = raycaster.ray.direction.x - clickStartP.x;
            let dy = raycaster.ray.direction.y - clickStartP.y;
            let dz = raycaster.ray.direction.z - clickStartP.z;
            let movableDirections = curIntersectPlane.movableDirections;
            // console.log("dx: " + dx + ", dy: " + dy + ", dz: " + dz);
            if (!rotatingAxis) {
                let arr = [];
                if (movableDirections.x) {
                    arr.push({"d": "x", "v": dx, "absV": Math.abs(dx)});
                }
                if (movableDirections.y) {
                    arr.push({"d": "y", "v": dy, "absV": Math.abs(dy)});
                }
                if (movableDirections.z) {
                    arr.push({"d": "z", "v": dz, "absV": Math.abs(dz)});
                }
                arr.sort(function(a , b){
                    return b.absV - a.absV;
                });
                // console.log("dx: " + dx + ", dy: " + dy + ", dz: " + dz);
                // console.log("direction: " + arr[0].d + ", val: " + arr[0].v);
                let rotateAxis = arr[1].d;
                rotatingAxis = arr[1].d;
                /*
                let rotateDir = (arr[0].v > 0)? 1: -1;
                let planePostion = curIntersectPlane.parentBox.getPosition();
                if (rotateAxis === "x") {
                    if((movableDirections.y && planePostion.z > 0) || (movableDirections.z && planePostion.y < 0)){
                        rotateDir = -rotateDir;
                    }
                }
                else if (rotateAxis === "y") {
                    if((movableDirections.z && planePostion.x < 0) || (movableDirections.x && planePostion.z > 0)){
                        rotateDir = -rotateDir;
                    }
                }
                else if (rotateAxis === "z") {
                    if((movableDirections.y && planePostion.x > 0) || (movableDirections.x && planePostion.y < 0)){
                        rotateDir = -rotateDir;
                    }
                }
                rotateDir = (rotateDir === 1)? "Cw": "CCw";* /
                let curBoxIndex = curIntersectPlane.parentBox.id;
                //get Rotate plane index
                let rotateIndex = cube.getRotationPlaneIndex(rotateAxis, curBoxIndex);
                rotatingPlaneIndex = rotateIndex;
                cube.constructRotationGroup(rotateAxis, rotateIndex);
                // actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": rotateAxis, "index": rotateIndex, "direction": rotateDir});
            }
            let rotateDir = 1;
            let planePostion = curIntersectPlane.parentBox.getPosition();
            if (rotatingAxis === "x") {
                if((movableDirections.y && planePostion.z > 0) || (movableDirections.z && planePostion.y < 0)){
                    rotateDir = -rotateDir;
                }
            }
            else if (rotatingAxis === "y") {
                if((movableDirections.z && planePostion.x < 0) || (movableDirections.x && planePostion.z > 0)){
                    rotateDir = -rotateDir;
                }
            }
            else if (rotatingAxis === "z") {
                if((movableDirections.y && planePostion.x > 0) || (movableDirections.x && planePostion.y < 0)){
                    rotateDir = -rotateDir;
                }
            }
            switch (rotatingAxis) {
                case "x":
                    if (movableDirections.y) {
                        cube.rotateGroup(rotateDir * dy, 0, 0);
                    }
                    else if (movableDirections.z) {
                        cube.rotateGroup(rotateDir * dz, 0, 0);
                    }
                    break;
                case "y":
                    if (movableDirections.x) {
                        cube.rotateGroup(0, rotateDir * dx, 0);
                    }
                    else if (movableDirections.z) {
                        cube.rotateGroup(0, rotateDir * dz, 0);
                    }
                    break;
                case "z":
                    if (movableDirections.x) {
                        cube.rotateGroup(0, 0, rotateDir * dx);
                    }
                    else if (movableDirections.y) {
                        cube.rotateGroup(0, 0, rotateDir * dy);
                    }
                    break;
            }
            */
        } else {
            mouseMoved = false;
        }
    }

    function onMouseDown(event) {
        event.preventDefault();
        getIntersction(event.clientX, event.clientY);
    }

    function onMouseUp(event) {
        event.preventDefault();
        if (!orbitControls.enabled && mouseMoved && curIntersectPlane) {
            //with box clicked
            //console.log(curIntersectPlane);            
            mouse.x = getMousePositionX(event.clientX);
            mouse.y = getMousePositionY(event.clientY);
            raycaster.setFromCamera(mouse, camera);
            let dx = raycaster.ray.direction.x - clickStartP.x;
            let dy = raycaster.ray.direction.y - clickStartP.y;
            let dz = raycaster.ray.direction.z - clickStartP.z;
            let arr = [];
            let movableDirections = curIntersectPlane.movableDirections;
            if (movableDirections.x) {
                arr.push({"d": "x", "v": dx, "absV": Math.abs(dx)});
            }
            if (movableDirections.y) {
                arr.push({"d": "y", "v": dy, "absV": Math.abs(dy)});
            }
            if (movableDirections.z) {
                arr.push({"d": "z", "v": dz, "absV": Math.abs(dz)});
            }
            arr.sort(function(a , b){
                return b.absV - a.absV;
            });
            // console.log("dx: " + dx + ", dy: " + dy + ", dz: " + dz);
            // console.log("direction: " + arr[0].d + ", val: " + arr[0].v);
            let rotateDir = (arr[0].v > 0)? 1: -1;
            let rotateAxis = arr[1].d;
            let planePostion = curIntersectPlane.parentBox.getPosition();
            if (rotateAxis === "x") {
                if((movableDirections.y && planePostion.z > 0) || (movableDirections.z && planePostion.y < 0)){
                    rotateDir = -rotateDir;
                }
            }
            else if (rotateAxis === "y") {
                if((movableDirections.z && planePostion.x < 0) || (movableDirections.x && planePostion.z > 0)){
                    rotateDir = -rotateDir;
                }
            }
            else if (rotateAxis === "z") {
                if((movableDirections.y && planePostion.x > 0) || (movableDirections.x && planePostion.y < 0)){
                    rotateDir = -rotateDir;
                }
            }
            rotateDir = (rotateDir === 1)? "Cw": "CCw";
            let curBoxIndex = curIntersectPlane.parentBox.id;
            //get Rotate plane index
            let rotateIndex = cube.getRotationPlaneIndex(rotateAxis, curBoxIndex);
            actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": rotateAxis, "index": rotateIndex, "direction": rotateDir});
        }
        mouseMoved = false;
        orbitControls.enabled = true;
        rotatingAxis = null;
        rotatingPlaneIndex = null;
        // cube.restoreChildList();
    }

    function onTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            let touchPoint = event.targetTouches[0];
            getIntersction(touchPoint.pageX, touchPoint.pageY);
        }
    }

    function onTounchMove(event) {
        event.preventDefault();
        // console.log("onTounchMove!");
        // console.log(event);
        if (!orbitControls.enabled) {
            //with box clicked
            // console.log(curIntersectPlane);
            mouseMoved = true;
        }
        // else {
        //     mouseMoved = false;
        // }
    }

    function onTouchEnd(event) {
        event.preventDefault();
        if (event.changedTouches.length === 1) {
            let touchPoint = event.changedTouches[0];
            // let result = getIntersction(touchPoint.pageX, touchPoint.pageY);
            if (!orbitControls.enabled && mouseMoved && curIntersectPlane) {
                //with box clicked
                mouse.x = getMousePositionX(touchPoint.pageX);
                mouse.y = getMousePositionY(touchPoint.pageY);
                raycaster.setFromCamera(mouse, camera);
                let dx = raycaster.ray.direction.x - clickStartP.x;
                let dy = raycaster.ray.direction.y - clickStartP.y;
                let dz = raycaster.ray.direction.z - clickStartP.z;
                let arr = [];
                let movableDirections = curIntersectPlane.movableDirections;
                if (movableDirections.x) {
                    arr.push({"d": "x", "v": dx, "absV": Math.abs(dx)});
                }
                if (movableDirections.y) {
                    arr.push({"d": "y", "v": dy, "absV": Math.abs(dy)});
                }
                if (movableDirections.z) {
                    arr.push({"d": "z", "v": dz, "absV": Math.abs(dz)});
                }
                arr.sort(function(a , b){
                    return b.absV - a.absV;
                });
                // console.log("dx: " + dx + ", dy: " + dy + ", dz: " + dz);
                // console.log("direction: " + arr[0].d + ", val: " + arr[0].v);
                let rotateDir = (arr[0].v > 0)? 1: -1;
                let rotateAxis = arr[1].d;
                let planePostion = curIntersectPlane.parentBox.getPosition();
                if (rotateAxis === "x") {
                    if((movableDirections.y && planePostion.z > 0) || (movableDirections.z && planePostion.y < 0)){
                        rotateDir = -rotateDir;
                    }
                }
                else if (rotateAxis === "y") {
                    if((movableDirections.z && planePostion.x < 0) || (movableDirections.x && planePostion.z > 0)){
                        rotateDir = -rotateDir;
                    }
                }
                else if (rotateAxis === "z") {
                    if((movableDirections.y && planePostion.x > 0) || (movableDirections.x && planePostion.y < 0)){
                        rotateDir = -rotateDir;
                    }
                }
                rotateDir = (rotateDir === 1)? "Cw": "CCw";
                let curBoxIndex = curIntersectPlane.parentBox.id;
                //get Rotate plane index
                let rotateIndex = cube.getRotationPlaneIndex(rotateAxis, curBoxIndex);
                actionQueue.register(TASK.ROTATE_CUBE, {"cube": cube, "axis": rotateAxis, "index": rotateIndex, "direction": rotateDir});
            }
            mouseMoved = false;
        }
        orbitControls.enabled = true;
    }

    function getIntersction(x, y) {
        let mesh = null;
        let intersects = [];

        mouse.x = getMousePositionX(x);
        mouse.y = getMousePositionY(y);

        raycaster.setFromCamera(mouse, camera);
        raycaster.intersectObject(cube.getGroup(), true, intersects);
        if ( intersects.length > 0) {
            var intersectObj = intersects[0].object.userData;
            if (intersectObj.isPlane) {
                clickStartP.x = raycaster.ray.direction.x;
                clickStartP.y = raycaster.ray.direction.y;
                clickStartP.z = raycaster.ray.direction.z;
                curIntersectPlane = intersectObj;
                orbitControls.enabled = false;
                return;
            }
            else if (intersectObj.isBox) {
                orbitControls.enabled = false;
                // console.log("intersect: point");
                // console.log(intersects[0].point);
                // console.log("parent position");
                // console.log(intersects[0].object.parent.position);
            }
        }
        curIntersectPlane = null;
    }

    function getMousePositionX(x){
        return (x / window.innerWidth) * 2 - 1;
    }
    
    function getMousePositionY(y){
        return -(y / window.innerHeight) * 2 + 1;
    }

    function initPanel() {
        var sizeDropdown = $('#cubeSize');
        var speedDropdown = $('#speed');
        var mixUpBtn = $('[btn-for="mixUpCube"]');
        var restoreBtn = $('[btn-for="restoreCube"]');
        sizeDropdown.empty();
        speedDropdown.empty();
        availableCubeSize.forEach(function(size) {
            sizeDropdown.append($('<option value="' + size + '"></option>').text(size + ' X ' + size));
        });
        availableSpeed.forEach(function(speed) {
            speedDropdown.append($('<option value="' + speed + '"></option>').text(speed));
        });
        speedDropdown.val(1 / perRotationTime);
        sizeDropdown.val(cubeSize);

        speedDropdown.off('change').change(function(){
            var speed = $(this).val();
            perRotationTime = 1 / speed;
        });

        sizeDropdown.off('change').change(function(){
            cubeSize = parseInt($(this).val());
            actionQueue.register(TASK.RESTORE_CUBE, {scene: scene});
            camera.position.set(cubeWidth * cubeSize, cubeWidth * cubeSize, cubeWidth * cubeSize);
        });
        
        mixUpBtn.click(function(e) {
            e.stopPropagation();
            actionQueue.register(TASK.MIX_UP_CUBE, {scene: scene});
        });
        
        restoreBtn.click(function(e) {
            e.stopPropagation();
            actionQueue.register(TASK.RESTORE_CUBE, {scene: scene});
        });
    }
}
