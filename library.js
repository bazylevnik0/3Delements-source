import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.151.3/three.module.js';
//not remember but maybe it need be like a module or something like this

export var scenes_cameras_renderers = {};
//api
export function create_3D_button(canvas_id,caller,width,height,rotation_x,rotation_y,rotation_z,color,text) {
    console.log("create_3D_button\n");
    prepare_WebGL_context(canvas_id);
//grab canvas element
//prepare context
//create mesh with properties
//connect caller to handle
}

//common functions for api's
export function prepare_WebGL_context(canvas_id,library="three.js"){
    console.log("prepare_WebGL_context\n");
    scenes_cameras_renderers[canvas_id] = {}
    scenes_cameras_renderers[canvas_id].scene    = new THREE.Scene();
    scenes_cameras_renderers[canvas_id].camera   = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    scenes_cameras_renderers[canvas_id].renderer = new THREE.WebGLRenderer();
    
}

