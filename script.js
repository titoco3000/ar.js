let markerVisible = false;
const limiteMovimentoRaquete = 0.5;

function debugPrint(msg){
    document.getElementById("debug-box").innerText = msg;
}

AFRAME.registerComponent('registerevents', {
    init: function () 
    {
        let marker = this.el;
        let follower = document.querySelector("#follower");
        let followerPlane = document.querySelector("#followerPlane");
        
        marker.addEventListener('markerFound', function() {
            // check if marker is found for the first time;
            //  if so, make object visible and align position/rotation.
            if ( follower.getAttribute("active") == "0" )
            {
                follower.setAttribute("active", "1");
                followerPlane.setAttribute("material", "visible", "true");   
            }
            markerVisible = true;
        });

        marker.addEventListener('markerLost', function() {
            markerVisible = false;
        });
        
        this.p = new THREE.Vector3();
        this.q = new THREE.Quaternion();
        this.s = new THREE.Vector3();   
        
        this.posRaquete = new THREE.Vector3();
        this.posRaquete.x = 0.3;
        this.posRaquete.y = 0.3;

    },
    
    tick: function (time, deltaTime) 
    {
        // if marker is visible, align the entity to the marker
        if (markerVisible)
        {
            let marker = this.el;
            let follower = document.querySelector("#follower");
            let followerPlane = document.querySelector("#followerPlane");
            let raquete = document.querySelector("#raquete");

            let lerpAmount = 0.5;

            marker.object3D.getWorldPosition(this.p);
            //this.p = {x: 0.22031927108778004,y: 0.23739206791029588, z: -2.604285955428952};
			
            
            marker.object3D.getWorldQuaternion(this.q);
            // const quaternion = new THREE.Quaternion();
            // quaternion.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI / 2 );
            // this.q = quaternion;

			marker.object3D.getWorldScale(this.s);


			follower.object3D.position.lerp(this.p, lerpAmount);
            follower.object3D.quaternion.slerp(this.q, lerpAmount);
			follower.object3D.scale.lerp(this.s, lerpAmount);
            
            followerPlane.setAttribute("color", "green");
            
            const euler = new THREE.Euler().setFromQuaternion(follower.object3D.quaternion, "XYZ");
            
            debugPrint(`${Math.round(euler.x*180.0/Math.PI)}, ${Math.round(euler.y*180.0/Math.PI)}, ${Math.round(euler.z*180.0/Math.PI)}`);
            const inclinacao = Math.sin(euler.y);
            console.log(inclinacao);
            this.posRaquete.x = Math.min(Math.max(this.posRaquete.x-inclinacao*deltaTime*0.001, -limiteMovimentoRaquete),limiteMovimentoRaquete);
            // if(inclinacao>110)
            //     console.log('direita');
            // if(inclinacao<70)
            //     console.log('esquerda');
			raquete.object3D.position.lerp(this.posRaquete, lerpAmount);

        } 
        else
        {
            followerPlane.setAttribute("color", "red");            
        }
    }
});