import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.151.3/three.module.js';

export var scenes_cameras_renderers = {};
export var objects_materials = {};
export var animates_handlers = {};

//api
export function create_3D_button(canvas_id,caller,width,height,rotation_x,rotation_y,rotation_z,color,text) {
    console.log("create_3D_button\n");
    prepare_WebGL_context(canvas_id);
    
    objects_materials[canvas_id] = {};
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    objects_materials[canvas_id].object = new THREE.Mesh( geometry, material );
    scene.add( objects_materials[canvas_id].object );

    scenes_cameras_renderers[canvas_id].camera.position.z = 5;

    animates_handlers[canvas_id]=  {};
    animates_handlers[canvas_id].animate = function () {
	    requestAnimationFrame( animates_handlers[canvas_id].animate );

	    objects_materials[canvas_id].object.rotation.x += 0.01;
	    objects_materials[canvas_id].object.rotation.y += 0.01;

	    scenes_cameras_renderers[canvas_id].renderer.render( scenes_cameras_renderers[canvas_id].scene, scenes_cameras_renderers[canvas_id].camera );
    }

    animates_handlers[canvas_id].animate();
}

//common functions for api's
export function prepare_WebGL_context(canvas_id,library="three.js"){
    let canvas = document.getElementById(canvas_id);
    console.log("prepare_WebGL_context\n");
    scenes_cameras_renderers[canvas_id] = {}
    scenes_cameras_renderers[canvas_id].scene    = new THREE.Scene();
    scenes_cameras_renderers[canvas_id].camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scenes_cameras_renderers[canvas_id].renderer = new THREE.WebGLRenderer( { canvas: canvas } );
}

