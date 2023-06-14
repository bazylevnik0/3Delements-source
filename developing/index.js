import * as EL3D from "./library.js"

let viewer0 = {
    canvas_id: "canvas_0",
    mode: "viewer",
    url: 'https://bazylevnik0.github.io/3Delements-source/models/sample(object).glb',
    width: 0.25,
    position_x: -1,
    rotation_x: 0.25,
}
viewer0 = new EL3D.Viewer(viewer0);
viewer0.init();

let viewer1 = {
    canvas_id: "canvas_1",
    mode: "viewer",
    url: 'https://bazylevnik0.github.io/3Delements-source/models/sample(object).glb',
    width: 0.25,
    height: 2.225,
    position_x: 1,
    rotation_x: 0.25,
    rotation_y: 0.25,
}
viewer1 = new EL3D.Viewer(viewer1);
viewer1.init();

let viewer2 = {
    canvas_id: "canvas_2",
    mode: "viewer",
    url: 'https://bazylevnik0.github.io/3Delements-source/models/sample(object).glb',
    width: 1.5,
    height: 1.5,
    depth: 1.5,
    rotation_x: 0.5,
    rotation_y: 0.25,
    rotation_z: 0.55,
}
viewer2 = new EL3D.Viewer(viewer2);
viewer2.init();

let viewer3 = {
    canvas_id: "canvas_3",
    mode: "background",
    url: 'https://bazylevnik0.github.io/3Delements-source/models/sample(room).glb',
    rotation_y: -1.25,
    width: 3.5,
    height: 3.5,
    depth: 3.5,     //"time":[position] 
    position_path: [{"2":[1,0,1]},{"4":[-1,0,1]}],
    position_path_cycle: true,
    rotation_path: [{"2":[0,25,0,0]},{"4":[-0.25,0,0]}],
    rotation_path_cycle: true,
}
viewer3 = new EL3D.Viewer(viewer3);
viewer3.init();

let viewer4 = {
    canvas_id: "canvas_4",
    mode: "background",
    url: 'https://bazylevnik0.github.io/3Delements-source/models/sample(room).glb',
    rotation_y: -1.25,
    camera_mode: "ortographic",
    width: 3,
    height: 3,
    depth: 3,
}
viewer4 = new EL3D.Viewer(viewer4);
viewer4.init();

