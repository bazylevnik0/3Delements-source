import * as EL3D from "./library.js"

let graph = {
    canvas_id: "canvas_1",
    data: {april:10,may:30,june:200,july:40},
    label_y: "label_y",
    label_x: "label_x",
}
    graph = new EL3D.Graph(graph);
    graph.init();
