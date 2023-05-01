import * as Library from "./library.js"

let user_function = function(user_vars){
    console.log("user_function with user vars:",user_vars[0]);
}

let button = {
    canvas_id: "canvas_1",
    text: "press",
    caller_click: user_function,
    caller_click_args: ["caller_click"],
    caller_hover: user_function,
    caller_hover_args: ["caller_hover"],
    width: 1.6,
    rotation_x: 0.1,
    rotation_y: 0.3,
    rotation_z: 0.0001,
}
    button = new Library.Button(button);
    button.init();

let button2 = {
    canvas_id: "canvas_2",
    color: "pink",
    text: "press me",
    text_size: 10,
    text_color: "blue",
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
    width: 3,
    height: 1.5,
    depth: 1.5,
    rotation_x:  -0.3,
    rotation_y: -0.2,
    rotation_z: 0.1,
}
    button3 = new Library.Button(button3);
    button3.init();

