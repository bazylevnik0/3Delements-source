import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
			
export var scenes_cameras_renderers = {};
export var objects_materials_models = {};
export var animates_handlers = {};

//api
export function create_3D_button(canvas_id,caller,width,height,rotation_x,rotation_y,rotation_z,color,text) {
    console.log("create_3D_button in",canvas_id,"\n");
    prepare_WebGL_context(canvas_id);
    
    objects_materials_models[canvas_id] = {};
    /*
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    objects_materials_models[canvas_id].object = new THREE.Mesh( geometry, material );
    scenes_cameras_renderers[canvas_id].scene.add( objects_materials_models[canvas_id].object );
    */
    const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

			const loader = new GLTFLoader();
			loader.setDRACOLoader( dracoLoader );
			loader.load( 'https://bazylevnik0.github.io/3Delements-source/models/button.glb', function ( gltf ) {

				objects_materials_models[canvas_id].model = gltf.scene;
				objects_materials_models[canvas_id].model.position.set( 1, 1, 0 );
				//model.scale.set( 0.01, 0.01, 0.01 );
				scenes_cameras_renderers[canvas_id].scene.add( objects_materials_models[canvas_id].model );

				//mixer = new THREE.AnimationMixer( model );
				//mixer.clipAction( gltf.animations[ 0 ] ).play();

				//animate();

			}, undefined, function ( e ) {

				console.error( e );

			} );



    scenes_cameras_renderers[canvas_id].camera.position.z = 5;

    animates_handlers[canvas_id]=  {};
    animates_handlers[canvas_id].animate = function () {
	    requestAnimationFrame( animates_handlers[canvas_id].animate );

	    //objects_materials_models[canvas_id].object.rotation.x += 0.01;
	    //objects_materials_models[canvas_id].object.rotation.y += 0.01;

	    scenes_cameras_renderers[canvas_id].renderer.render( scenes_cameras_renderers[canvas_id].scene, scenes_cameras_renderers[canvas_id].camera );
    }

    animates_handlers[canvas_id].animate();
}

//common functions for api's
export function prepare_WebGL_context(canvas_id,library="three.js"){
    let canvas = document.getElementById(canvas_id);
    console.log("prepare_WebGL_context for ",canvas_id,"\n");
    scenes_cameras_renderers[canvas_id] = {}
    scenes_cameras_renderers[canvas_id].scene    = new THREE.Scene();
    scenes_cameras_renderers[canvas_id].camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scenes_cameras_renderers[canvas_id].renderer = new THREE.WebGLRenderer( { canvas: canvas } );
}
