//24.04.23
//things to do:
//change camera to isometric - done
//fix positions - done
//fix bug with first element - done
//fix bug when you resize canvas -done
//add width/height/and all args -done
//bug when canvas behind vertical border of screen - done
//add text to button
//add color
//need checks when only width but non height, when rotation_x but non rotation_y

import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
			
export var data = {};

//api
export class Button {
  constructor(button) {
    this.canvas_id          = button.canvas_id;
    this.caller_click       = button.caller_click;
    this.caller_click_args  = button.caller_click_args;
    this.caller_hover       = button.caller_hover;
    this.caller_hover_args  = button.caller_hover_args;
    this.width              = button.width;
    this.height             = button.height;
    this.depth              = button.depth;
    this.rotation_x         = button.rotation_x;
    this.rotation_y         = button.rotation_y;
    this.rotation_z         = button.rotation_z;
    this.init = function(){
        let canvas_id = this.canvas_id;
        console.log("start create_3D_button in ", canvas_id,"...");
        
        data[canvas_id] = {};
        prepare_WebGL_context(canvas_id);
        
        //set animation loop and handlers
        data[canvas_id].clock = new THREE.Clock();
        data[canvas_id].camera.position.set(0,0,5);
        data[canvas_id].animate = function () {
            data[canvas_id].mixer.update( data[canvas_id].clock.getDelta() );

	        requestAnimationFrame( data[canvas_id].animate );
	        data[canvas_id].renderer.render( data[canvas_id].scene, data[canvas_id].camera );
        }
        data[canvas_id].canvas.addEventListener('pointermove', (e) => {
            console.log(e.clientX,e.clientY,e.clientX - data[canvas_id].canvas.offsetLeft,e.clientY - data[canvas_id].canvas.offsetTop,e.clientX - data[canvas_id].canvas.offsetLeft/ data[canvas_id].canvas.clientWidth * 2 - 1,e.clientY - data[canvas_id].canvas.offsetTop / data[canvas_id].canvas.clientHeight  * -2 + 1);
            data[canvas_id].mouse.set((e.clientX - data[canvas_id].canvas.offsetLeft) / data[canvas_id].canvas.clientWidth * 2 - 1, (e.clientY - data[canvas_id].canvas.offsetTop) / data[canvas_id].canvas.clientHeight  * -2 + 1- document.scrollTop);
            
            data[canvas_id].raycaster.setFromCamera(data[canvas_id].mouse, data[canvas_id].camera)
            data[canvas_id].intersects = data[canvas_id].raycaster.intersectObjects(data[canvas_id].scene.children, true)
        
            data[canvas_id].intersects.forEach((hit) => {
                console.log("button in canvas ",canvas_id," hovered\n")
                switch(data[canvas_id].model.hover){
                    case 0:
                        data[canvas_id].model.hover++;
                    case 1:
                        this.caller_hover(this.caller_hover_args);
                        data[canvas_id].model.hover++;
                        break;
                    default: 
                       data[canvas_id].model.hover++;
                       break;
                }    
             })
             if(data[canvas_id].intersects.length==0)data[canvas_id].model.hover = 0;
        })
        data[canvas_id].canvas.addEventListener('click', (e) => {
          data[canvas_id].intersects.forEach((hit) => {
            console.log("button in canvas ",canvas_id," pressed\n"); 
            if(this.caller_click){
                if(this.caller_click_args){
                    this.caller_click(this.caller_click_args);
                } else {   
                    this.caller_click();
                }
            }
            for (let i = 0; i < data[canvas_id].animations.length; i++) {   
                let animation = data[canvas_id].mixer.clipAction( data[canvas_id].animations[ i ] ); 
                    animation.reset();
                    animation.setLoop( THREE.LoopOnce );
                    animation.play(); 
            }      
          })
        })
        
        
        
        let width = this.width;
        let height = this.depth;
        let depth = this.height; //yep little mess, but model is not oriented now
        let rotation_x = this.rotation_x;
        let rotation_y = this.rotation_y;
        let rotation_z = this.rotation_z;
        let text = this.text;
        //load models 
        let dracoLoader = new DRACOLoader();
		      dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );
        let loader = new GLTFLoader();
		      loader.setDRACOLoader( dracoLoader );
		      loader.load( 'https://bazylevnik0.github.io/3Delements-source/models/button.glb', function ( gltf ) {
				    data[canvas_id].model = gltf.scene;
				                   //temporary: must be 0, 0, 0 
				    data[canvas_id].model.position.set( 0, 0, 0 );
				    if(width && height && depth){
				      data[canvas_id].model.scale.set( 1*width, 1*height, 1*depth );
				    }
				    if(rotation_x && rotation_y && rotation_z){
				        data[canvas_id].model.rotation.set(0+rotation_x, -1*Math.PI/2+rotation_y, 0+rotation_z);
				    }
				    data[canvas_id].model.hover = 0;
				    data[canvas_id].scene.add( data[canvas_id].model );
				    data[canvas_id].mixer = new THREE.AnimationMixer( data[canvas_id].model );
				    data[canvas_id].animations = gltf.animations;
				    
				    
				    //add text
				    //create image
				    data[canvas_id].canvas_text = document.createElement('canvas').getContext('2d');
                    data[canvas_id].canvas_text.canvas.width = 100;
                    data[canvas_id].canvas_text.canvas.height = 100;
                    
                    data[canvas_id].canvas_text.fillStyle = "blue";
                    data[canvas_id].canvas_text.fillRect(0, 0, data[canvas_id].canvas_text.canvas.width, data[canvas_id].canvas_text.canvas.height);
                    data[canvas_id].canvas_text.font = 'Bold 20px Arial';
                    data[canvas_id].canvas_text.fillStyle = 'green';
                    data[canvas_id].canvas_text.fillText("asd", 0, 20);

                    document.body.appendChild(data[canvas_id].canvas_text.canvas);
                    
                    //canvas contents will be used for a texture
                    data[canvas_id].texture = new THREE.CanvasTexture(data[canvas_id].canvas_text.canvas) 
                    //get all children inside gltf file
	                data[canvas_id].model.traverse( function ( child ) {
		                //get the meshes
		                if (child.isMesh ) {
		                    child.material = new THREE.MeshBasicMaterial({
			                                    color: new THREE.Color(0xff0000),
			                                    map: data[canvas_id].texture,
			                                });
			                child.material.map.needsUpdate = true;
			                child.material.map.mapping = THREE.CubeReflectionMapping;
			            }
	                })
	        
	                data[canvas_id].animate();
			    }, undefined, function ( e ) {  
				    console.error( e );
			    } );
    
        
        //add light
        data[canvas_id].ambientLight = new THREE.AmbientLight()
        data[canvas_id].pointLight = new THREE.PointLight()
        data[canvas_id].pointLight.position.set(10, 10, 10)
        //data[canvas_id].scene.add(data[canvas_id].ambientLight)
        data[canvas_id].scene.add(data[canvas_id].pointLight)
        
        console.log("...end create_3D_button in ",canvas_id);
        }
  }
}

export function prepare_WebGL_context(canvas_id,library="three.js"){
    console.log("start prepare_WebGL_context for ",canvas_id,"...");
    
    data[canvas_id].canvas = document.getElementById(canvas_id);
    data[canvas_id].scene  = new THREE.Scene();
    data[canvas_id].camera = new THREE.OrthographicCamera( data[canvas_id].canvas.width/75 / - 2, data[canvas_id].canvas.width/75 / 2, data[canvas_id].canvas.height/75 / 2, data[canvas_id].canvas.height/75 / - 2, -10, 1000 );
    //data[canvas_id].camera   = new THREE.PerspectiveCamera( 75, data[canvas_id].canvas.width / data[canvas_id].canvas.height, 0.1, 1000 );
    data[canvas_id].renderer = new THREE.WebGLRenderer( { canvas: data[canvas_id].canvas, alpha: true } );
   
    data[canvas_id].raycaster = new THREE.Raycaster();
    data[canvas_id].mouse = new THREE.Vector2()
    
    console.log("...end prepare_WebGL_context for ",canvas_id);
}

