import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.151.3/three.module.js';
//not remember but maybe it need be like a module or something like this

var scenes_cameras_renderers = {};
//api
function create_3D_button(canvas_id,caller,width,height,rotation_x,rotation_y,rotation_z,color,text) {
    console.log("create_3D_button\n");
    prepare_WebGL_context(canvas_id);

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    scenes_cameras_renderers[canvas_id].camera.position.z = 5;

    function animate() {
	    requestAnimationFrame( animate );

	    cube.rotation.x += 0.01;
	    cube.rotation.y += 0.01;

	    renderer.render( scenes_cameras_renderers[canvas_id].scene, scenes_cameras_renderers[canvas_id].camera );
    }

    animate();
}

//common functions for api's
function prepare_WebGL_context(canvas_id,library="three.js"){
    console.log("prepare_WebGL_context\n");
    scenes_cameras_renderers[canvas_id] = {}
    scenes_cameras_renderers[canvas_id].scene    = new THREE.Scene();
    scenes_cameras_renderers[canvas_id].camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scenes_cameras_renderers[canvas_id].renderer = new THREE.WebGLRenderer();
    
}

