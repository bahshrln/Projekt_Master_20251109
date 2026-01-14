

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//http://localhost:8080/geoserver/wfs?format_options=callback:handleJson&service=WFS&version=1.1.0&request=GetFeature&typename=britta%3Agis_osm_landuse_a_free_rheinlandpfalz&srsname=EPSG%3A4326&outputFormat=text%2Fjavascript&_=1749809588046
//Geoserver Web Feature Service
$.ajax('http://localhost:8080/geoserver/britta/ows?',{
  type: 'GET',
  data: {
    service: 'WFS',
    version: '1.1.0',
    request: 'GetFeature',
    typename: 'britta:Wiesen_in_Mainz',
    CQL_FILTER: "column='fclass'",
    srsname: 'EPSG:4326',
    'X-Content-Type-Options': nosniff

    //outputFormat: 'application/json'
    },
  dataType: 'jsonp',
  jsonpCallback:'callback:handleJson',
  jsonp:'format_options'
 });
  //Geojson style file
  var myStyle = {
    'color': 'red'
  }
// the ajax callback function
function handleJson(data) {
    selectedArea = L.geoJson(data, {
      style: myStyle,
      onEachFeature: function(feature, layer) {
        layer.bindPopup(`Name: ${feature.properties.fclass}`)
      }
    }).addTo(map);
  map.fitBounds(selectedArea.getBounds());
}

var wfs_json ='http://localhost:8080/geoserver/britta/ows?'
+'service=WFS&version=1.0.0&request=GetFeature&'
+'typeName=britta%3AWiesen_in_Mainz&'
+'outputFormat=application%2Fjson&maxFeatures=50';

//http://localhost:8080/geoserver/britta/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=britta%3Aschwerpunkte_in_mainz_joined__mean_coordinates&outputFormat=application%2Fjson&maxFeatures=50
//http://localhost:8080/geoserver/britta/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=britta%3Abuildings_in_mainz_hessen__gis_osm_pois_free_1_hessen&outputFormat=application%2Fjson&maxFeatures=50

//var wms_url = http://localhost:8080/geoserver/britta/wms?service=WMS&version=1.1.0&request=GetMap&layers=britta%3Agis_osm_landuse_a_free_rheinlandpfalz&bbox=6.0383945%2C48.9193065%2C8.5728267%2C50.9521457&width=768&height=616&srs=EPSG%3A25832&styles=&format=image%2Fsvg%20xml


