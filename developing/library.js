//2.05.23
//things to do:
//create example in codepen
//create documentation template
//write documentation for button


import * as THREE from 'three';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
			
export var data = {};

//api
export class Button {
  constructor(button) {
    this.canvas_id          = button.canvas_id;
    this.color              = button.color;
    this.text               = button.text;
    this.text_size          = button.text_size;
    this.text_color         = button.text_color;
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
        data[canvas_id] = {};               //create object for canvas in data
        prepare_WebGL_context(canvas_id);   //prepare drawing context with common template for all apis
        
        //set animation loop and handlers
        data[canvas_id].clock = new THREE.Clock(); //time for animation
        data[canvas_id].camera.position.set(0,0,5);
        //live rendering, calling in the end of this class
        data[canvas_id].animate = function () {
            data[canvas_id].mixer.update( data[canvas_id].clock.getDelta() ); //update animations 

	        requestAnimationFrame( data[canvas_id].animate );
	        data[canvas_id].renderer.render( data[canvas_id].scene, data[canvas_id].camera );
        }
        //hover
        data[canvas_id].canvas.addEventListener('pointermove', (e) => {
  //convert and store position of mouce in NDC format
  data[canvas_id].mouse.set((e.clientX-data[canvas_id].canvas.offsetLeft)*(2/data[canvas_id].canvas.clientWidth)-1, (e.clientY-data[canvas_id].canvas.offsetTop+window.scrollY)*(2/data[canvas_id].canvas.clientHeight)-1);            
            data[canvas_id].raycaster.setFromCamera(data[canvas_id].mouse, data[canvas_id].camera) 
            data[canvas_id].intersects = []; 
            data[canvas_id].raycaster.intersectObject(data[canvas_id].model, true, data[canvas_id].intersects); //store intersected objects(hovered objects)
            //logic( in simple words: if object hovered but not have the hover indicator(undefined)- then set the indicator to 0  then set indicator to 1 for marking it like a first hover - and call user function, then while it is hovering just not paying attention for hovering, also when non hovered - refresh indicator)
            if(data[canvas_id].intersects.length==0)this.hover=0;  //if object not hovered length of hovered objects = 0
            console.log(this.hover)
            data[canvas_id].intersects.forEach((hit) => {
                switch(this.hover){
                    case undefined:
                        this.hover = 0; //if object not have indicator of hover
                    case 0:
                        this.hover++;
                    case 1:
                        //call user function, only when first intersection(hovering)
                        if(this.caller_hover) {
                            if(this.caller_hover_args){
                                this.caller_hover(this.caller_hover_args);
                            } else this.caller_hover();
                        }
                    default: 
                       this.hover++; //not paying attention if non first hovering
                       break;
                }
             })
        })
        //click(depend from hover - handle object intersections when moving pointer)
        data[canvas_id].canvas.addEventListener('click', (e) => {
           //also if length = 1 then one object is hovered
           if(data[canvas_id].intersects.length==1){ 
               //call user function
               if(this.caller_click){
                                if(this.caller_click_args){
                                    this.caller_click(this.caller_click_args);
                                } else {   
                                    this.caller_click();
                                }
                            } 
               //launch model animation
               for (let i = 0; i < data[canvas_id].animations.length; i++) {   
                    let animation = data[canvas_id].mixer.clipAction( data[canvas_id].animations[ i ] ); 
                        animation.reset();
                        animation.setLoop( THREE.LoopOnce );
                        animation.play(); 
                }      
            }
        })
        
        //load and set model 
        //set local vars
        let width = this.width;
        let height = this.depth;
        let depth = this.height; //yep little mess, but model is not oriented now
        let rotation_x = this.rotation_x;
        let rotation_y = this.rotation_y;
        let rotation_z = this.rotation_z;
        let color = this.color;
        let text = this.text;
        let text_size = this.text_size;
        let text_color = this.text_color;
        //set loader for model
        let dracoLoader = new DRACOLoader();
		      dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );
        let loader = new GLTFLoader();
		      loader.setDRACOLoader( dracoLoader );
		      //load and set model from folder /models
		      loader.load( 'https://bazylevnik0.github.io/3Delements-source/models/button.glb', function ( gltf ) {
				    data[canvas_id].model = gltf.scene;
				    data[canvas_id].model.position.set( 0, 0, 0 ); //set position to 0
				    //set size, when some parameters undefined just ignore
				    width?width=width:width=1;
				    height?height=height:height=1;
				    depth?depth=depth:depth=1;
				    data[canvas_id].model.scale.set(depth,height,width);
				    //set rotation, also same logic as in size setting
				    rotation_x?rotation_x=rotation_x:rotation_x=0;
                    rotation_y?rotation_y=rotation_y:rotation_y=0;
                    rotation_z?rotation_z=rotation_z:rotation_z=0;
				    data[canvas_id].model.rotation.set(0+rotation_x, -1*Math.PI/2+rotation_y, 0+rotation_z);
				    
				    data[canvas_id].scene.add( data[canvas_id].model ); //add to scene
				    data[canvas_id].mixer = new THREE.AnimationMixer( data[canvas_id].model );
				    data[canvas_id].animations = gltf.animations; //store animation in global data
				    
				    
				    //add text
				    //create canvas with text 
				    data[canvas_id].canvas_text = document.createElement('canvas').getContext('2d');
                    data[canvas_id].canvas_text.canvas.width  = data[canvas_id].canvas.width*width;
                    data[canvas_id].canvas_text.canvas.height = data[canvas_id].canvas.height*height;
                    
                    //set color of background of button(in this case it is color of canvas) - if default then gray
                    if(color){
                        data[canvas_id].canvas_text.fillStyle = color;
                    } else data[canvas_id].canvas_text.fillStyle = "gray";
                    //draw background
                    data[canvas_id].canvas_text.fillRect(0, 0, data[canvas_id].canvas_text.canvas.width, data[canvas_id].canvas_text.canvas.height);
                    //set size of text, if undefined then 12
                    if(text_size==undefined)text_size = 12;
                    data[canvas_id].canvas_text.font = 'Bold '+text_size+'px Arial';
                    //set color of text, if undefined then white
                    if(text_color){
                        data[canvas_id].canvas_text.fillStyle = text_color;
                    } else data[canvas_id].canvas_text.fillStyle = "white";
                    //draw text, if text is undefined then use just a clear string
                    if(text==undefined)text = "";
                    data[canvas_id].canvas_text.fillText(text, 10, data[canvas_id].canvas_text.canvas.height/2+(height*10));
                    //canvas contents will be used for a texture
                    data[canvas_id].texture = new THREE.CanvasTexture(data[canvas_id].canvas_text.canvas) 
                    data[canvas_id].texture.flipY = false;
                    data[canvas_id].texture.center = new THREE.Vector2( 0.5, 0.5 ); 
                    data[canvas_id].texture.rotation = Math.PI/2;  //rotate canvas content for mapping in model
                    data[canvas_id].texture.repeat.set( 2,4 );     //some magic number for correct position of text in model
                    data[canvas_id].texture.offset = new THREE.Vector2( -0.05, 0 ); //same magic numbers
                    //set texture as the material in model  
				    //get all children inside gltf file
	                data[canvas_id].model.traverse( function ( child ) {
		                //get the meshes
		                if (child.isMesh ) {
		                    child.material = new THREE.MeshStandardMaterial({
			                                    map: data[canvas_id].texture,
			                                });
			                child.material.map.needsUpdate = true;
			            }
	                })
	        
	                data[canvas_id].animate(); //launch live rendering
			    }, undefined, function ( e ) {  
				    console.error( e );
			    } );
    
        
        //add light
        data[canvas_id].ambientLight = new THREE.AmbientLight()
        data[canvas_id].ambientLight.intensity = 0.2;
        data[canvas_id].pointLight = new THREE.PointLight()
        data[canvas_id].pointLight.position.set(10, 10, 10)
        data[canvas_id].scene.add(data[canvas_id].ambientLight)
        data[canvas_id].scene.add(data[canvas_id].pointLight)
        
        console.log("...end create_3D_button in ",canvas_id);
        }
  }
}

export function prepare_WebGL_context(canvas_id,library="three.js"){
    console.log("start prepare_WebGL_context for ",canvas_id,"...");
    
    //create canvas, scene, camera, renderer, raycaster, mouse for api and store it in data with name of canvas id
    data[canvas_id].canvas = document.getElementById(canvas_id);
    data[canvas_id].scene  = new THREE.Scene();
    data[canvas_id].camera = new THREE.OrthographicCamera( data[canvas_id].canvas.width/75 / - 2, data[canvas_id].canvas.width/75 / 2, data[canvas_id].canvas.height/75 / 2, data[canvas_id].canvas.height/75 / - 2, -10, 1000 );
    //data[canvas_id].camera   = new THREE.PerspectiveCamera( 75, data[canvas_id].canvas.width / data[canvas_id].canvas.height, 0.1, 1000 );
    data[canvas_id].renderer = new THREE.WebGLRenderer( { canvas: data[canvas_id].canvas, alpha: true,antialias: true } );
   
    data[canvas_id].raycaster = new THREE.Raycaster();
    data[canvas_id].mouse = new THREE.Vector2()
    
    console.log("...end prepare_WebGL_context for ",canvas_id);
}


