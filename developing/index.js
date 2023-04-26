import * as Library from "./library.js"


let user_function = function(user_vars){
    console.log("user_function with user vars:",user_vars[0],user_vars[1]);
}

let button = {
    canvas_id: "canvas_1",
    text: "press",
    text_size: 120,
    caller_hover: user_function,
    caller_hover_args: [1,2],
    width: 2,
    height: 1,
    depth: 1,
    rotation_x: 0.1,
    rotation_y: 0.3,
    rotation_z: 0.0001,
}
    button = new Library.Button(button);
    button.init();

let button2 = {
    canvas_id: "canvas_2",
    text: "press me",
    text_size: 10,
    caller_hover: user_function,
    caller_hover_args: [1,2],
    width: 0.75,
    height: 0.5,
    depth: 0.25,
    rotation_x: 0.1,
    rotation_y: 0.2,
    rotation_z: 0.3,
}
    button2 = new Library.Button(button2);
    button2.init();

let button3 = {
    canvas_id: "canvas_3",
    text: "PRESS me plz!",
    text_size: 100,
    caller_hover: user_function,
    caller_hover_args: [1,2],
    width: 3,
    height: 1.5,
    depth: 1.5,
    rotation_x:  -0.3,
    rotation_y: -0.2,
    rotation_z: 0.1,
}
    button3 = new Library.Button(button3);
    button3.init();

