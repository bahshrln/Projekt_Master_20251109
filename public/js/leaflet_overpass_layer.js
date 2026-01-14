// var osm = new L.TileLayer(
//     'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//     {
//         'opacity': 0.7,
//         'attribution': [attr_osm, attr_overpass].join(', ')
//     }
// );

// var opl = new L.OverPassLayer({

//     'query': '(node({{bbox}})[organic];node({{bbox}})[second_hand];);out qt;',
// });

// map.addLayer(opl);



export function hello() {
    return "Hello Overpasslayer";
}