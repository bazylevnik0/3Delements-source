import * as EL3D from "./library.js"

let graph = {
    canvas_id: "canvas_1",
    data: [{maasdasdasdy:100,sas1:200,july:300,april1:150,may1:350,june1:500},
           {masfay:600,mayaslas1:400,may1:200,june1:400,july1:600},
           {masfay:100,mayaslas1:200}],
    //!maybe data_styles :
    label_y: "label_y",
    label_x: "label_x",
    label_val: true,
    type: "bar",
}
    graph = new EL3D.Graph(graph);
    graph.init();
