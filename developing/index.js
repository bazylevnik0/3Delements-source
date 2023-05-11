import * as EL3D from "./library.js"

let graph = {
    canvas_id: "canvas_1",
    data: {april:15,may:320,june:210,july:460,april1:50,may1:160,june1:20,july1:40},
    label_y: "label_y",
    label_x: "label_x",
    label_val: true,
    type: "line",
}
    graph = new EL3D.Graph(graph);
    graph.init();
