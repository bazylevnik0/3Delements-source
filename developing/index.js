import * as EL3D from "./library.js"

let graph = {
    canvas_id: "canvas_1",
    data: {april:10,may:30,june:20,july:40,april1:10,may1:30,june1:20,july1:40},
    label_y: "label_y",
    label_x: "label_x",
    type: "line",
}
    graph = new EL3D.Graph(graph);
    graph.init();
