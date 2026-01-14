//Geoserver Web Feature Service
$.ajax('http://localhost:8080/geoserver/wfs',{
  type: 'GET',
  data: {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typename: 'workspace:layer_name',
    srsname: 'EPSG:4326',
    outputFormat: 'text/javascript',
    },
  dataType: 'jsonp',
  jsonpCallback:'callback:handleJson',
  jsonp:'format_options'
 });

// the ajax callback function
function handleJson(data) {
    selectedArea = L.geoJson(data).addTo(map);
  map.fitBounds(selectedArea.getBounds());
}

export function hello() {
    return "Hello Layer to Display";
}