import * as THREE from 'three';
//test click animation 9
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
			
export var data = {};

//api
export function create_3D_button(canvas_id,caller,width,height,rotation_x,rotation_y,rotation_z,color,text) {
    console.log("start create_3D_button in ",canvas_id,"...");
    
    data[canvas_id] = {};
    prepare_WebGL_context(canvas_id);
    
    //set animation loop and handlers
    data[canvas_id].clock = new THREE.Clock();
    data[canvas_id].camera.position.x = 1;   //  
    data[canvas_id].camera.position.y = 1;  //
    data[canvas_id].camera.position.z = 2.5; //default position of camera
    data[canvas_id].animate = function () {
     	data[canvas_id].mixer.update( data[canvas_id].clock.getDelta() );

	    requestAnimationFrame( data[canvas_id].animate );
	    data[canvas_id].renderer.render( data[canvas_id].scene, data[canvas_id].camera );
    }
    data[canvas_id].canvas.addEventListener('pointermove', (e) => {
                                                //try window.innerWidth
        data[canvas_id].mouse.set((e.clientX / data[canvas_id].canvas.width) * 2 - 1, -(e.clientY / data[canvas_id].canvas.height) * 2 + 1)
        
        data[canvas_id].raycaster.setFromCamera(data[canvas_id].mouse, data[canvas_id].camera)
        data[canvas_id].intersects = data[canvas_id].raycaster.intersectObjects(data[canvas_id].scene.children, true)

        data[canvas_id].intersects.forEach((hit) => {
            console.log("button in canvas ",canvas_id," hovered\n"); 
        })
    })
    data[canvas_id].canvas.addEventListener('click', (e) => {
      data[canvas_id].intersects.forEach((hit) => {
        console.log("button in canvas ",canvas_id," pressed\n"); 
        for (let i = 0; i < data[canvas_id].animations.length; i++) {   
            let animation = data[canvas_id].mixer.clipAction( data[canvas_id].animations[ i ] ); 
                animation.reset();
                animation.setLoop( THREE.LoopOnce );
                animation.play(); 
        }      
      })
    })

    //load models 
    let dracoLoader = new DRACOLoader();
		  dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );
    let loader = new GLTFLoader();
		  loader.setDRACOLoader( dracoLoader );
		  loader.load( 'https://bazylevnik0.github.io/3Delements-source/models/button.glb', function ( gltf ) {
				data[canvas_id].model = gltf.scene;
				                                    //0,0,0
				data[canvas_id].model.position.set( 1, 1, 0 );
				//data[canvas_id].model.scale.set( 1+width, 1+height, 1 );
				//data[canvas_id].model.rotation.set( 0+rotation_x, 0+rotation_y, 0+rotation_z );
				data[canvas_id].scene.add( data[canvas_id].model );
				data[canvas_id].mixer = new THREE.AnimationMixer( data[canvas_id].model );
				data[canvas_id].animations = gltf.animations;
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
    
    console.log("...end create_3D_button in ",canvas_id);
}

//common functions for api's
export function prepare_WebGL_context(canvas_id,library="three.js"){
    console.log("start prepare_WebGL_context for ",canvas_id,"...");
    
    data[canvas_id].canvas = document.getElementById(canvas_id);
    data[canvas_id].scene    = new THREE.Scene();
    data[canvas_id].camera   = new THREE.PerspectiveCamera( 75, data[canvas_id].canvas.width / data[canvas_id].canvas.height, 0.1, 1000 );
    data[canvas_id].renderer = new THREE.WebGLRenderer( { canvas: data[canvas_id].canvas, alpha: true } );
   
    data[canvas_id].raycaster = new THREE.Raycaster();
    data[canvas_id].mouse = new THREE.Vector2()
    
    console.log("...end prepare_WebGL_context for ",canvas_id);
}
