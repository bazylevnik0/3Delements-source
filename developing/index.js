import * as Library from "./library.js"


let user_function = function(user_vars){
    console.log("user_function with user vars:",user_vars[0],user_vars[1]);
}

let button = {
    canvas_id: "canvas_1",
    text: "press me",
    caller_hover: user_function,
    caller_hover_args: [1,2],
    width: 1,
    height: 2,
    depth: 1,
    rotation_x: 0.1,
    rotation_y: 0.3,
    rotation_z: 0.0001,
}
    button = new Library.Button(button);
    button.init();
/*
let button2 = {
    canvas_id: "canvas_2",
    caller_hover: user_function,
    caller_hover_args: [1,2],
    width: 3,
    height: 1.5,
    depth: 0.5,
    rotation_x: 0.1,
    rotation_y: 0.2,
    rotation_z: 0.3,
}
    button2 = new Library.Button(button2);
    button2.init();

let button3 = {
    canvas_id: "canvas_3",
    caller_hover: user_function,
    caller_hover_args: [1,2],
    width: 3,
    height: 1.5,
    depth: 0.5,
    rotation_x: 0.1,
    rotation_y: 0.2,
    rotation_z: 0.3,
}
    button3 = new Library.Button(button3);
    button3.init();
*/
