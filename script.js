console.log('inicio');
const devMode = false;
let contador = 0;

let markerVisible = !devMode;

let follower;
let followerPlane;
let box;

const debugPanel = document.getElementById("debug-panel");

function log(msg){
    debugPanel.innerText = msg;
}

const inicialPos = { x: -0.5141670107841488, y: 0.1589715331792831, z: -2.479588747024536 };
const inicialQuat = { _w: 0.7990519268419295, _x: 0.5954808666830201, _y: 0.06974318637430985, _z: 0.04532597024881846 };
const inicialScale = { x: 1.0000000120139396, y: 1.0000000110266491, z: 1.0000000106087483 };

AFRAME.registerComponent('registerevents', {
    init: function () {
        let marker = this.el;
        if (!follower) {
            follower = document.querySelector("#follower");
            followerPlane = document.querySelector("#followerPlane");
            box = document.querySelector("#box");
        }

        marker.addEventListener('markerFound', function () {
            // check if marker is found for the first time;
            //  if so, make object visible and align position/rotation.
            if (follower.getAttribute("active") == "0") {
                follower.setAttribute("active", "1");
                followerPlane.setAttribute("material", "visible", "true");
                loop();
            }
            markerVisible = true;
        });

        marker.addEventListener('markerLost', function () {
            markerVisible = false;
        });
        if (devMode) {
            if (follower.getAttribute("active") == "0") {
                follower.setAttribute("active", "1");
                followerPlane.setAttribute("material", "visible", "true");
                loop();
            }
            this.p = inicialPos;
            this.q = inicialQuat;
            this.s = inicialScale;
        }
        else {
            this.p = new THREE.Vector3();
            this.q = new THREE.Quaternion();
            this.s = new THREE.Vector3();
        }
    },

    tick: function (time, deltaTime) {
        let lerpAmount = 0.5;
        // if marker is visible, align the entity to the marker
        if (markerVisible) {
            let marker = this.el;


            marker.object3D.getWorldPosition(this.p);
            marker.object3D.getWorldQuaternion(this.q);
            marker.object3D.getWorldScale(this.s);
            console.log(
                marker.object3D.getWorldPosition(this.p),
                marker.object3D.getWorldQuaternion(this.q),
                marker.object3D.getWorldScale(this.s)
            );

            follower.object3D.position.lerp(this.p, lerpAmount);
            follower.object3D.quaternion.slerp(this.q, lerpAmount);
            follower.object3D.scale.lerp(this.s, lerpAmount);

            followerPlane.setAttribute("color", "green");
        }
        else {
            followerPlane.setAttribute("color", "red");
            if (devMode) {
                follower.object3D.position.lerp(inicialPos, lerpAmount);
                follower.object3D.quaternion.slerp(inicialQuat, lerpAmount);
                follower.object3D.scale.lerp(inicialScale, lerpAmount);
            }
        }
    }
});

let lastExecTime = new Date();
let execTime;
let deltaTime; //seconds since last loop

let boxPos = [0, 0, 0];

function loop() {
    execTime = new Date();
    deltaTime = (execTime - lastExecTime) / 1000;
    if (follower) {
        const euler = new THREE.Euler().setFromQuaternion(follower.object3D.quaternion, "XYZ");
        log(`${Math.round(euler.x * 180 / Math.PI)}, ${Math.round(euler.z * 180 / Math.PI)}`);
        // console.log(deltaTime);
        boxPos[0] += 0.001 * deltaTime;
        box.setAttribute("position", `${boxPos[0]} ${boxPos[1]} ${boxPos[2]}`);
    }
    lastExecTime = execTime;
    requestAnimationFrame(loop);
}
