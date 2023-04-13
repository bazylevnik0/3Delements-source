import * as THREE from 'three';
//test animation 1
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
			
export var data = {};

//api
export function create_3D_button(canvas_id,caller,width,height,rotation_x,rotation_y,rotation_z,color,text) {
    console.log("create_3D_button in",canvas_id,"\n");
    data[canvas_id] = {};
    prepare_WebGL_context(canvas_id);
    
    //set animation loop and handlers
    data[canvas_id].camera.position.z = 5; //default position of camera
    data[canvas_id].animate = function () {
	    requestAnimationFrame( data[canvas_id].animate );
	    data[canvas_id].renderer.render( data[canvas_id].scene, data[canvas_id].camera );
    }
    
    //load models 
    let dracoLoader = new DRACOLoader();
		  dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

	let loader = new GLTFLoader();
		  loader.setDRACOLoader( dracoLoader );
		  loader.load( 'https://bazylevnik0.github.io/3Delements-source/models/button.glb', function ( gltf ) {
				data[canvas_id].model = gltf.scene;
				data[canvas_id].model.position.set( 1, 1, 0 );
				data[canvas_id].scene.add( data[canvas_id].model );
				data[canvas_id].mixer = new THREE.AnimationMixer( data[canvas_id].model );
				//temp:
				for (let i = 0; i < gltf.animations.length; i++) {                      
                    data[canvas_id].mixer.clipAction( gltf.animations[ i ] ).play(); 
                }      
                //
				data[canvas_id].animate();
			}, undefined, function ( e ) {
				console.error( e );
			} );

    //add light
    data[canvas_id].ambientLight = new THREE.AmbientLight()
    data[canvas_id].pointLight = new THREE.PointLight()
    data[canvas_id].pointLight.position.set(10, 10, 10)
    data[canvas_id].scene.add(data[canvas_id].ambientLight)
    data[canvas_id].scene.add(data[canvas_id].pointLight)
}

//common functions for api's
export function prepare_WebGL_context(canvas_id,library="three.js"){
    console.log("prepare_WebGL_context for ",canvas_id,"\n");
    data[canvas_id].canvas = document.getElementById(canvas_id);
    data[canvas_id].scene    = new THREE.Scene();
                                                                //must be related to canvas size not to window
    data[canvas_id].camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    data[canvas_id].renderer = new THREE.WebGLRenderer( { canvas: data[canvas_id].canvas, alpha: true } );
}
