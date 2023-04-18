import * as Library from "./library.js"

let user_function = function(){
  console.log("user_function\n")
}
user_function();
Library.create_3D_button("canvas_1",user_function,0.25 ,0.25 ,-0.25);
Library.create_3D_button("canvas_2",user_function,0 ,0 ,0);
Library.create_3D_button("canvas_3",user_function,0 ,-0.25 ,0);
