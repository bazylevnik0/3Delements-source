import * as THREE from 'three';

import { GLTFLoader }    from 'three/addons/loaders/GLTFLoader.js';      //need for button
import { DRACOLoader }   from 'three/addons/loaders/DRACOLoader.js';     //need for button
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';  //need for graph
import { FontLoader }    from 'three/addons/loaders/FontLoader.js';
import { TextGeometry }  from 'three/addons/geometries/TextGeometry.js'; //need for text

//!for viewer need a perspective camera
export var data = {};
console.log("test");
//api
export class Viewer {
  constructor(viewer) {
    this.canvas_id     = viewer.canvas_id;
    this.url           = viewer.url;
    this.scale         = viewer.scale;
    this.width         = viewer.width;
    this.height        = viewer.height;
    this.depth         = viewer.depth;
    this.position_x    = viewer.position_x;
    this.position_y    = viewer.position_y;
    this.position_z    = viewer.position_z;
    this.rotation_x    = viewer.rotation_x;
    this.rotation_y    = viewer.rotation_y;
    this.rotation_z    = viewer.rotation_z;
    this.mode          = viewer.mode;
    this.position_path = viewer.position_path;
    this.rotation_path = viewer.rotation_path;
    this.init = function(){
        let canvas_id = this.canvas_id;
        console.log(canvas_id);
        data[canvas_id] = {};               //create object in data
        prepare_WebGL_context(canvas_id);   //prepare drawing context with common template for all apis
        
        if(this.mode=="viewer"||this.mode==undefined)
        {
            //add controls
            // controls
		    data[canvas_id].controls = new OrbitControls( data[canvas_id].camera, data[canvas_id].renderer.domElement );
		    data[canvas_id].controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		    data[canvas_id].controls.dampingFactor = 0.05;
		    data[canvas_id].controls.screenSpacePanning = false;
		    data[canvas_id].controls.minDistance = 100;
		    data[canvas_id].controls.maxDistance = 500;
		    data[canvas_id].controls.maxPolarAngle = Math.PI / 2;
        }	
    
        //set animation loop and handlers
        data[canvas_id].clock = new THREE.Clock(); //time for animation
        data[canvas_id].camera.position.set(0,0,5);
        //live rendering, calling in the end of this class
        data[canvas_id].animate = function () {
            data[canvas_id].mixer.update( data[canvas_id].clock.getDelta() ); //update animations 

	        requestAnimationFrame( data[canvas_id].animate );
	        data[canvas_id].renderer.render( data[canvas_id].scene, data[canvas_id].camera );
        }
       
        let width    = this.width;
        let height   = this.height;
        let depth    = this.depth;
        let position_x = this.position_x;
        let position_y = this.position_y;
        let position_z = this.position_z;
        const dracoLoader = new DRACOLoader();
			dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

			const loader = new GLTFLoader();
			loader.setDRACOLoader( dracoLoader );
			loader.load( 'https://bazylevnik0.github.io/3Delements-source/models/sample.glb', function ( gltf ) {

				data[canvas_id].model = gltf.scene;
				
				//set position
				position_x?position_x=position_x:position_x=0;
				position_y?position_y=position_y:position_y=0;
				position_z?position_z=position_z:position_z=0;    
			    data[canvas_id].model.position.set( 0+position_x, 0+position_y, 0+position_z );
				//set scale
				width?width=width:width=1;
				height?height=height:height=1;
				depth?depth=depth:depth=1;
				data[canvas_id].model.scale.set( width, height, depth );
		    
				
				data[canvas_id].scene.add( data[canvas_id].model );

				data[canvas_id].mixer = new THREE.AnimationMixer( data[canvas_id].model );
				gltf.animations.map(el=>data[canvas_id].mixer.clipAction(el).play())
			
				data[canvas_id].animate();

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
    
    }
  }
}

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
        let input = this.input;
        let input_keys   = Object.keys(input);
        let input_values = Object.values(input);
        let input_width  = 0;
        let input_height = 0;
        let max_value = Number.MIN_VALUE;
        let min_value = Number.MAX_VALUE;
        if(input){
            //analyze input
            
            //define correctness of input(and fix if possible)
            let check = true;
            input_values.map(el=>{
                if(!Array.isArray(el)){         //if not array
                    if(typeof(el)=='number'){   //but number convert to array[0]
                        el=[el];              
                    } else check = false;       //if not number - this is incorrectly
                }
            })
            if(!check){console.log("input values must be only numbers or arrays");return;}; //if incorrectly and not possible to fix then not loaded 
        
            //find input_height - "layers", input_width - max length values, and max/min
            input_width = input_keys.length;
            input_values.map(el=>{
                let temp_length = el.length;
                if(temp_length  > input_height)input_height = temp_length;
                for(let i = 0; i < temp_length; i++){
                    if(el[i]>max_value)max_value=el[i];
                    if(el[i]<min_value)min_value=el[i];
                }
            })
        } else {
            console.log("empty input"); 
            return;
        }
        
        //calculate measure on 1 point - related to the canvas
        let size_1_width  = data[canvas_id].canvas.width/(input_width+2)/100;
        let size_1_height = data[canvas_id].canvas.height/(input_height+2)/100;
        let delta = max_value - min_value; //working only with diapason between max and min
        
        
        //calculate and load
        //load plane with with axes
        
        //plane
        let geometry_plane    = new THREE.PlaneGeometry( input_width*size_1_width, input_height*size_1_height );
        let material_plane    = new THREE.MeshBasicMaterial( {color: 0xf4f4f4, side: THREE.DoubleSide} );
        data[canvas_id].plane = new THREE.Mesh( geometry_plane, material_plane );
        data[canvas_id].plane.position.set(0,0-max_value*3*size_1_height/delta/2,0);
        data[canvas_id].plane.rotation.set(Math.PI/2,0,0);
        data[canvas_id].scene.add(data[canvas_id].plane);
    
        //y 
        //axis                                            
        let geometry_axis_y    = new THREE.BoxGeometry( 0.025, max_value*3*size_1_height/delta, 0.025 ); 
        let material_axis_y    = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
        data[canvas_id].axis_y = new THREE.Mesh(geometry_axis_y, material_axis_y); 
        data[canvas_id].axis_y.position.set(-1*input_width*size_1_width/2,0,input_height*size_1_height/2);
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
            context_label_y.fillText(""+this.label_y, canvas_label_y.width/2, canvas_label_y.height/2);
        } else {
            context_label_y.fillText("y" , canvas_label_y.width/2, canvas_label_y.height/2);
        }
        let texture_label_y = new THREE.Texture(canvas_label_y) 
        texture_label_y.needsUpdate  = true;
        let sprite_material_label_y  = new THREE.SpriteMaterial( { map: texture_label_y } );
            data[canvas_id].label_y  = new THREE.Sprite( sprite_material_label_y );
            data[canvas_id].label_y.position.set(-1*input_width*size_1_width/2,size_1_height*1.5,input_height*size_1_height/2);
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
        if(!this.type)this.type="bar";
        if(this.type == "bar"){
            console.log("bar");
            data[canvas_id].bars = [];
            for(let layer = 0; layer < input_height; layer++){
                data[canvas_id].bars[layer] = []
                let temp_values = input_values.map(el=>el[layer]);
                for(let i = 0; i < temp_values.length; i++){
                if(temp_values[i]){
                    let geometry = new THREE.BoxGeometry( size_1_width, temp_values[i]*3*size_1_height/delta, size_1_height ); 
                    let material = new THREE.MeshPhongMaterial( {color: 0x0000ff} ); 
                    data[canvas_id].bars[layer][i] = new THREE.Mesh( geometry, material ); 
                 data[canvas_id].bars[layer][i].position.set(size_1_width*((1-input_width)/2+i),(3/2)*(size_1_height/delta)*(temp_values[i]-max_value),size_1_height*(input_height/2-layer)-size_1_height/2);
                    data[canvas_id].scene.add( data[canvas_id].bars[layer][i] );
                 }   
                }
            }
        } 
        if(this.type == "line"){
            console.log("line");
            data[canvas_id].points = [];
            data[canvas_id].lines  = [];
            for(let layer = 0; layer < input_height; layer++){
                data[canvas_id].points[layer] = [];   
                let temp_values = input_values.map(el=>el[layer]);
                for(let i = 0; i < temp_values.length; i++){
                    if(temp_values[i]){
                        data[canvas_id].points[layer].push( new THREE.Vector3(size_1_width*((1-input_width)/2+i),3*(size_1_height/delta)*(temp_values[i]-max_value),size_1_height*(input_height/2-layer)-size_1_height/2) );
                    }
                }
                let geometry = new THREE.BufferGeometry().setFromPoints( data[canvas_id].points[layer] );
                let material = new THREE.LineBasicMaterial( { color: 0x0000ff} );
                data[canvas_id].lines[layer] = new THREE.Line( geometry, material );
                data[canvas_id].lines[layer].position.set(0,(3/2)*(size_1_height),0)
                data[canvas_id].scene.add( data[canvas_id].lines[layer] );
            }
        }
        
        //add labales of values and keys
        if(this.label_val){
            const loader = new FontLoader();
            loader.load( 'https://bazylevnik0.github.io/3Delements-source/fonts/open_sans_medium.json', function ( font ) {
                 //add labels of values
                 data[canvas_id].labels_values        = [];
                 data[canvas_id].labels_values_meshes = [];
                 //calculate measurement delta and store steps of measure numbers, store it in array
                 let step = delta / 10;
                 for(let i = 0; i < 10; i++)data[canvas_id].labels_values[i]=min_value+step*i;
                 //draw labels_values
                 for(let i = 0; i < 10; i++){
                    let geometry = new TextGeometry(""+data[canvas_id].labels_values[i], {
		                font: font,
		                size: max_value*3*size_1_height/delta/10/2,
		                height: 0,
		                curveSegments: 6,
	                });
	                let material = new THREE.MeshBasicMaterial( {color: 0xff0000} ); 
                    data[canvas_id].labels_values_meshes[i] = new THREE.Mesh(geometry, material);
                    let size = new THREE.Vector3();
                    geometry.computeBoundingBox();
                    geometry.boundingBox.getSize(size);
                    data[canvas_id].labels_values_meshes[i].position.set(-1*input_width*size_1_width/2,0-(max_value*3*size_1_height/delta)*(1/2-i/10) ,input_height*size_1_height/2+0.05+size.x);   
                    data[canvas_id].labels_values_meshes[i].rotation.set(0,Math.PI/2,0);
                    data[canvas_id].scene.add(data[canvas_id].labels_values_meshes[i]);                       
                 }
                 
                 //add labels of keys
                 data[canvas_id].labels_keys_meshes = [];
                 //draw labels_values
                 for(let i = 0; i < input_keys.length; i++){
                    let geometry = new TextGeometry(""+input_keys[i], {
		                font: font,
		                size: max_value*3*size_1_height/delta/10/2,
		                height: 0,
		                curveSegments: 6,
	                });
	                let material = new THREE.MeshBasicMaterial( {color: 0xff0000} ); 
                    data[canvas_id].labels_keys_meshes[i] = new THREE.Mesh(geometry, material);
                    let size = new THREE.Vector3();
                    geometry.computeBoundingBox();
                    geometry.boundingBox.getSize(size);
                    data[canvas_id].labels_keys_meshes[i].position.set(size_1_width*((1-input_width)/2+i),0-max_value*3*size_1_height/delta/2,input_height*size_1_height/2+0.05+size.x);   
                    data[canvas_id].labels_keys_meshes[i].rotation.set(-Math.PI/2,0,Math.PI/2);   
                    data[canvas_id].scene.add(data[canvas_id].labels_keys_meshes[i]);                       
                 }
            });
        }
        
      
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


