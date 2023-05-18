import * as THREE from 'three';

import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';      //need for button
import { DRACOLoader }   from 'three/addons/loaders/DRACOLoader.js';     //need for button
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';  //need for graph
import { FontLoader }    from 'three/addons/loaders/FontLoader.js';
import { TextGeometry }  from 'three/addons/geometries/TextGeometry.js'; //need for text

export var data = {};

//!bugs and etc
//when labels of values near then they are covering each other
//!fix labels and all old things to the new with koef_x

//api
export class Graph {
  constructor(graph) {
    this.canvas_id = graph.canvas_id;
    this.type      = graph.type;
    this.label_x   = graph.label_x;
    this.label_y   = graph.label_y;
    this.label_val = graph.label_val;
    this.input     = graph.data;
    this.groups    = graph.groups;
    this.init      = function(){
        let canvas_id = this.canvas_id;
        let type = this.type;
        console.log("start create_3D_graph in ", canvas_id,"...");
        data[canvas_id] = {};               //create object in data
        prepare_WebGL_context(canvas_id);   //prepare drawing context with common template for all apis
    
        data[canvas_id].camera.position.set(0,0,1);
        //live rendering, calling in the end of this class
        data[canvas_id].animate = function () {
	        requestAnimationFrame( data[canvas_id].animate );
	        
	        data[canvas_id].controls.update();
	        data[canvas_id].renderer.render( data[canvas_id].scene, data[canvas_id].camera );
        }
        //temporary:
        //analyze input
        let input_width;
        let input_height;
        let max_value;
        let min_value;
        if(this.input){
            if(Array.isArray(this.input)){
                console.log("input is array");
                let values = [];
                this.input.map(el=>values.push(Object.values(el)));
                //analyze each input and find 
                //height and width
                input_height = values.length;
                input_width = 0;
                let values_length =[];
                values.map(el=>{
                    values_length.push(el.length)
                    if(el.length>input_width)input_width=el.length;
                });
                //max_value and min_value
                max_value = Math.max(...values.toString().split(","));
                min_value = Math.min(...values.toString().split(","));
            } else {
                console.log("analyzing input");
                let values = Object.values(this.input)
                //height and width
                input_height = 1;
                input_width = values.length;
                //max_value and min_value
                max_value = Math.max(...values);
                min_value = Math.min(...values);
            }
        } else {
            console.log("empty input");
        }
        let size_1_width  = data[canvas_id].canvas.width/(input_width+2)/100;
        let size_1_height = data[canvas_id].canvas.height/(input_height+2)/100;
        let delta = max_value - min_value;
        
        //calculate and load
        //load plane with with axes
        
        //temporary:
        //plane
        let geometry_plane    = new THREE.PlaneGeometry( input_width*size_1_width, input_height*size_1_height );
        let material_plane    = new THREE.MeshBasicMaterial( {color: 0xf4f4f4, side: THREE.DoubleSide} );
        data[canvas_id].plane = new THREE.Mesh( geometry_plane, material_plane );
        data[canvas_id].plane.position.set(0,0-max_value*3*size_1_height/delta/2,0);
        data[canvas_id].plane.rotation.set(Math.PI/2,0,0);
        data[canvas_id].scene.add(data[canvas_id].plane);
    
        
        //y 
        //axis                                            
        let geometry_axis_y    = new THREE.BoxGeometry( 0.025, max_value*3*size_1_height/delta/2, 0.025 ); 
        let material_axis_y    = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        data[canvas_id].axis_y = new THREE.Mesh(geometry_axis_y, material_axis_y); 
        data[canvas_id].axis_y.position.set(-1*input_width*size_1_width/2,-1*max_value*3*size_1_height/delta/4,input_height*size_1_height/2);
        data[canvas_id].scene.add( data[canvas_id].axis_y );
        //label
        let canvas_label_y = document.createElement('canvas');
            canvas_label_y.width  = data[canvas_id].canvas.height;
            canvas_label_y.height = data[canvas_id].canvas.height;
        let context_label_y  = canvas_label_y.getContext('2d');
        context_label_y.font = "Bold "+canvas_label_y.height/8+"px Sans";
      
        context_label_y.fillStyle = "rgb(0,0,0,0.0)";
        context_label_y.fillRect(0, 0, canvas_label_y.width, canvas_label_y.height);
        context_label_y.fillStyle = "red";
        if(this.label_y){  
            context_label_y.fillText(""+this.label_y, canvas_label_y.width/2, canvas_label_y.height/8);
        } else {
            context_label_y.fillText("y" , canvas_label_y.width/2, canvas_label_y.height/2);
        }
        let texture_label_y = new THREE.Texture(canvas_label_y) 
        texture_label_y.needsUpdate  = true;
        let sprite_material_label_y  = new THREE.SpriteMaterial( { map: texture_label_y } );
            data[canvas_id].label_y  = new THREE.Sprite( sprite_material_label_y );
                                                                              //!
            data[canvas_id].label_y.position.set(-1*input_width*size_1_width/2,max_value/delta,input_height*size_1_height/2);
            data[canvas_id].scene.add(data[canvas_id].label_y);
        
        //x 
        //axis                                            
        let geometry_axis_x    = new THREE.BoxGeometry( input_width*size_1_width, 0.025, 0.025 ); 
        let material_axis_x    = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        data[canvas_id].axis_x = new THREE.Mesh( geometry_axis_x, material_axis_x ); 
        data[canvas_id].axis_x.position.set(0,0-max_value*3*size_1_height/delta/2,input_height*size_1_height/2);
        data[canvas_id].scene.add( data[canvas_id].axis_x );
        //label
        let canvas_label_x = document.createElement('canvas');
            canvas_label_x.width  = data[canvas_id].canvas.height;
            canvas_label_x.height = data[canvas_id].canvas.height;
        let context_label_x  = canvas_label_x.getContext('2d');
        context_label_x.font = "Bold "+canvas_label_y.height/8+"px Sans";
      
        context_label_x.fillStyle = "rgb(0,0,0,0.0)";
        context_label_x.fillRect(0, 0, canvas_label_x.width  , canvas_label_x.height);
        context_label_x.fillStyle = "red";
        if(this.label_x){  
            context_label_x.fillText(""+this.label_x, canvas_label_x.width/2, canvas_label_x.height/2);
        } else {
            context_label_x.fillText("x" , canvas_label_x.width/2, canvas_label_x.height/2);
        }
        let texture_label_x = new THREE.Texture(canvas_label_x) 
        texture_label_x.needsUpdate  = true;
        let sprite_material_label_x  = new THREE.SpriteMaterial( { map: texture_label_x } );
            data[canvas_id].label_x  = new THREE.Sprite( sprite_material_label_x );
            data[canvas_id].label_x.position.set(input_width*size_1_width/2,0-max_value*3*size_1_height/delta/2,input_height*size_1_height/2);
            //data[canvas_id].label_x.position.set(input_width/2+0.05,-2.5,input_height/2);
            data[canvas_id].scene.add(data[canvas_id].label_x); 
            
        //vizualize input
        //let koef_y;
        //let koef_x;
        if(!this.type)this.type="bar";
        //!add loops with y shift
        if(this.type == "bar"){
            console.log("bar");
            data[canvas_id].bars = [];
            for(let layer = 0; layer < input_height; layer++){
                data[canvas_id].bars[layer] = []
                let temp_values = Object.values(this.input[layer])
                for(let i = 0; i < input_width; i++){
                    let geometry = new THREE.BoxGeometry( size_1_width, temp_values[i]*3*size_1_height/delta, size_1_height ); 
                    let material = new THREE.MeshPhongMaterial( {color: 0x0000ff} ); 
                    data[canvas_id].bars[layer][i] = new THREE.Mesh( geometry, material ); 
                 data[canvas_id].bars[layer][i].position.set(size_1_width*((1-input_width)/2+i),(3/2)*(size_1_height/delta)*(temp_values[i]-max_value),size_1_height*(input_height/2-layer)-size_1_height/2);
                    data[canvas_id].scene.add( data[canvas_id].bars[layer][i] );
                }
            }
        } 
        if(this.type == "line"){
            console.log("line");
            data[canvas_id].points = [];
            data[canvas_id].lines  = [];
            for(let layer = 0; layer < input_height; layer++){
                data[canvas_id].points[layer] = [];   
                let temp_values = Object.values(this.input[layer])
                for(let i = 0; i < temp_values.length; i++){
                    data[canvas_id].points[layer].push( new THREE.Vector3(size_1_width*((1-input_width)/2+i),(3/2)*(size_1_height/delta)*(temp_values[i]-max_value),size_1_height*(input_height/2-layer)-size_1_height/2) );
                }
                let geometry = new THREE.BufferGeometry().setFromPoints( data[canvas_id].points[layer] );
                let material = new THREE.LineBasicMaterial( { color: 0x0000ff} );
                data[canvas_id].lines[layer] = new THREE.Line( geometry, material );
                data[canvas_id].scene.add( data[canvas_id].lines[layer] );
            }
        } 
        /*
        //add values labels
        let input = this.input;
        if(this.label_val){
            const loader = new FontLoader();
            loader.load( 'https://bazylevnik0.github.io/3Delements-source/fonts/open_sans_medium.json', function ( font ) {
                 data[canvas_id].texts = [];
                 let temp_keys = Object.keys(input)
                 //add keys labels
                 let i;
                 //if type bar - need find key with max length(for align) and precalculate geometry for koef_y of align
                 let abs_size = new THREE.Vector3();
                 if(type=="bar"){
                     let max_length = 0;
                     for(let j = 0; j < temp_keys.length; j++)if(temp_keys[max_length].length<temp_keys[j].length)max_length=j;
                     let geometry = new TextGeometry( temp_keys[max_length], {
		                    font: font,
		                    size: 1,
		                    height: 0,
		                    curveSegments: 6,
	                     } );
	                     geometry.computeBoundingBox();
                         geometry.boundingBox.getSize(abs_size);
	             }
	             //draw keys
                 for(i = 0; i < input_width; i++){
                     let geometry = new TextGeometry( temp_keys[i], {
		                font: font,
		                size: 1,
		                height: 0,
		                curveSegments: 6,
	                 } );
	                 let material = new THREE.MeshBasicMaterial( {color: 0xff0000} ); 
                     data[canvas_id].texts[i] = new THREE.Mesh( geometry, material ); 
                     if(type == "line") {
                         data[canvas_id].texts[i].position.set(-1*input_width/2+0.5+i,-2.45,input_height/2);
                         data[canvas_id].texts[i].rotation.set(-Math.PI/2,0,Math.PI/2);
                     }
                     if(type == "bar") {
                         geometry.computeBoundingBox()
                         //geometry.center()
                         let size = new THREE.Vector3();
                         geometry.boundingBox.getSize(size);
                         data[canvas_id].texts[i].position.set(-1*input_width/2+0.5+i,-2.45,input_height/2+abs_size.x*0.2+0.2-(abs_size.x-size.x)*0.2);
                         data[canvas_id].texts[i].rotation.set(-Math.PI/2,0,Math.PI/2);
                     }
                     data[canvas_id].texts[i].scale.set(0.2,0.2,0.1);
                     data[canvas_id].scene.add( data[canvas_id].texts[i] );
                 }
                 //add values labels
                 let temp_values_map = {};
                 let values = Object.values(input);
                 values.sort();
                 for(let j = 1; j < values.length-1; j++){
                    if(values[j]-values[j-1]<10){ //!need clever diapason
                        values.splice(j,1); j--;
                    }
                 }
                 //if type bar - need find key with max length(for align) and precalculate geometry for koef_y of align
                 abs_size = new THREE.Vector3();
                 if(type=="bar"){
                     let max_length = 0;
                     for(let j = 0; j < values.length; j++)if(""+values[max_length].length<""+values[j].length)max_length=j;
                     let geometry = new TextGeometry( values[max_length], {
		                    font: font,
		                    size: 1,
		                    height: 0,
		                    curveSegments: 6,
	                     } );
	                     geometry.computeBoundingBox();
                         geometry.boundingBox.getSize(abs_size);
	             }
	             //draw values
                 for(let j = 0; j < input_width; j++)temp_values_map[""+values[j]]=values[j];
                 Object.values(temp_values_map).map(el=>{
                         let geometry = new TextGeometry( ""+el, {
		                    font: font,
		                    size: 1,
		                    height: 0,
		                    curveSegments: 6,
	                     });
	                     let material = new THREE.MeshBasicMaterial( {color: 0xff0000} ); 
                         data[canvas_id].texts[i] = new THREE.Mesh( geometry, material ); 
                         if(type == "line") {
                             data[canvas_id].texts[i].position.set(-1*input_width/2,el*koef_y/2-2.5,input_height/2);
                             data[canvas_id].texts[i].rotation.set(0,0,0);
                         }
                         if(type == "bar" ) {
                              geometry.computeBoundingBox()
                             //geometry.center()
                             let size = new THREE.Vector3();
                             geometry.boundingBox.getSize(size);
                             data[canvas_id].texts[i].position.set(-1*input_width/2-abs_size.x*0.1-0.1+(abs_size.x-size.x)*0.1,el*koef_y/2-2.5,input_height/2);
                             data[canvas_id].texts[i].rotation.set(0,0,0);
                         } 
                         data[canvas_id].texts[i].scale.set(0.1,0.1,0.1);
                         data[canvas_id].scene.add( data[canvas_id].texts[i] );
                         i++;
                 });
            } );
        }
        */
        //add controls
        // controls
		data[canvas_id].controls = new OrbitControls( data[canvas_id].camera, data[canvas_id].renderer.domElement );
		data[canvas_id].controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		data[canvas_id].controls.dampingFactor = 0.05;
		data[canvas_id].controls.screenSpacePanning = false;
		data[canvas_id].controls.minDistance = 100;
		data[canvas_id].controls.maxDistance = 500;
		data[canvas_id].controls.maxPolarAngle = Math.PI / 2;
				
        data[canvas_id].animate(); //launch live rendering
        
        //add light
        data[canvas_id].ambientLight = new THREE.AmbientLight()
        data[canvas_id].ambientLight.intensity = 0.2;
        data[canvas_id].pointLight = new THREE.PointLight()
        data[canvas_id].pointLight.position.set(10, 10, 10)
        data[canvas_id].scene.add(data[canvas_id].ambientLight)
        data[canvas_id].scene.add(data[canvas_id].pointLight)
        
        console.log("...end create_3D_graph in ",canvas_id);     
    }
  }
}
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
    this.hover = 0;
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
                                                                            //change to open-sans
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


