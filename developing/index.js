import * as EL3D from "./library.js"

let viewer0 = {
    canvas_id: "canvas_0",
    mode: "viewer",
    width: 0.25,
    position_x: -1,
}
viewer0 = new EL3D.Viewer(viewer0);
viewer0.init();

let viewer1 = {
    canvas_id: "canvas_1",
    mode: "viewer",
    width: 0.25,
    height: 2.225,
    position_x: 1,
}
viewer1 = new EL3D.Viewer(viewer1);
viewer1.init();

let viewer2 = {
    canvas_id: "canvas_2",
    mode: "background",
    width: 0.5,
    height: 0.5,
    depth: 0.5,
    position_z: 10,
}
viewer2 = new EL3D.Viewer(viewer2);
viewer2.init();

let viewer3 = {
    canvas_id: "canvas_3",
}
viewer3 = new EL3D.Viewer(viewer3);
viewer3.init();

let viewer4 = {
    canvas_id: "canvas_4",
}
viewer4 = new EL3D.Viewer(viewer4);
viewer4.init();

