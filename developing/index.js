import * as Library from "./library.js"


let user_function = function(user_vars){
    console.log("user_function with user vars:",user_vars[0],user_vars[1]);
}

let button = {
    canvas_id: "canvas_1",
    caller_hover: user_function,
    caller_hover_args: [1,2],
    width: 3,
    height: 1.5,
    depth: 0.5,
    rotation_x: 0.1,
    rotation_y: 0.2,
    rotation_z: 0.3,
}
    button = new Library.Button(button);
    button.init();

