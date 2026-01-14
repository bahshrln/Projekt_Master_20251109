
// Die Map
let map = undefined;

let wms_url = "http://localhost:8080/geoserver/ows?"; // URL, um Geoserver anzusprechen für WMS-Abfrage

//let wfs_url = 'http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=britta:schwerpunkte_in_mainz_epsg_4326&outputFormat=application/json';
let wfs_url = 'http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=britta:ziele_in_der_umgebung_in_mainz__schwerpunkte_in_mainz_besondere_epsg_4326__schwerpunkte_in_mainz_epsg_4326&outputFormat=application/json';

// Quellenangabe für OverpassAPI
let attr_osm = 'Map data &copy; <a href="http://openstreetmap.org/">OpenStreetMap</a> contributors';
let attr_overpass = 'POI via <a href="http://www.overpass-api.de/">Overpass API</a>';

//const key = 'fuHw6mFhcXSIBWLdvHiU'; // Google-API-Key

//Legende für opls
function makeChange() {  
  if (document.getElementById('legende').style.display == 'block') {
    document.getElementById('legende').style.display='none'; 
  } else {
    document.getElementById('legende').style.display='block';
  }
   
    //document.getElementById('legendeButton').value = (document.getElementById('legendeButton').value=='Legende anzeigen'?'Legende ausblenden':'Legende anzeigen');
}

//let uri = "http://localhost:8080/geoserver/ows?request=GetLegendGraphic&service=WMS&version=1.3.0&sld_version=1.1.0&layer='britta:GreenPoisRheinlandPfalz'=Image/png";

//####################### Basemaps und WMS ####################################################

// Basemaps und WMS erstellen
let baseMaps = {

  'OSM': L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }),

  'Esri_WorldImagery': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	  attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }),

  'Stadia_AlidadeSmoothDark': L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
    minZoom: 0,
    maxZoom: 20,
    attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    ext: 'png'
  }),

  '<span style="color: red;">OpenStreetMap.HOT</span>': L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team hosted by OpenStreetMap France'
  }),
 
  'Strand': L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
    layers: 'britta:BeachesMainz',
    opacity: 0.5,
    attribution:'&copy; <a href="https://download.geofabrik.de">Geofabrik GmbH and OpenStreetMap Contributors</a>'    
  }),  

  'Parken': L.tileLayer.wms('http://localhost:8080/geoserver/wms?', {
    layers: ['britta:ParkplatzMainz', 'britta:ParkhausMainz'],
    opacity: 0.5,
    attribution:'&copy; <a href="https://download.geofabrik.de">Geofabrik GmbH and OpenStreetMap Contributors</a>'    
  }),

  'Grüne Orte': L.tileLayer.wms(wms_url, {
    layers: 'britta:GreenPoisMainz',
    format: 'image/png',
    opacity: 0.3,
    attribution:'&copy; <a href="https://www.hs-mainz.de">Hochschule Mainz</a>'
  })

  // 'Orte': L.tileLayer.wms('http://localhost:8080/geoserver/britta/wms?', {
  //   layers: '	britta:schwerpunkte_in_mainz_epsg_4326',
  //   opacity: 0.7,
  //   attribution:'&copy; <a href="https://www.hs-mainz.de">Hochschule Mainz</a>',
  //   // CQL_FILTER: 'fclass=biergarten&fclass=bar&' +
  //   // 'fclass=cafe&fclass=park&fclass=nightclub&' +
  //   // 'fclass=pub&fclass=restaurant&fclass=pitch&fclass=picnic_site'
  // })
  
};

 //###################### Icons #################################################
// Erzeugt ein Marker-Icon
function createIcon(iconFile) {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/${iconFile}`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
}

// Icon, das das Zentrum der Altstadt Mainz anzeigt
let altstadt_icon = createIcon('marker-icon-2x-blue.png');

// Erzeuge eine Map von Leaflet-Markern
const markerMap = {  
  bar: createIcon('marker-icon-2x-red.png'),
  biergarten: createIcon('marker-icon-2x-gold.png'),
  bistro: createIcon('marker-icon-2x-orange.png'),
  brauhaus: createIcon('marker-icon-2x-gold.png'),
  cafe: createIcon('marker-icon-2x-black.png'),
  cafe_mensa: createIcon('marker-icon-2x-black.png'),
  cafe_scand: createIcon('marker-icon-2x-black.png'),
  coffeeshop: createIcon('marker-icon-2x-black.png'),
  internet_cafe: createIcon('marker-icon-2x-black.png'),
  cocktailbar: createIcon('marker-icon-2x-red.png'),
  friseur: createIcon('marker-icon-2x-grey.png'),
  grill: createIcon('marker-icon-2x-orange.png'),
  kneipe: createIcon('marker-icon-2x-red.png'),
  lounge: createIcon('marker-icon-2x-orange.png'),
  nightclub: createIcon('marker-icon-2x-red.png'),
  restaurant: createIcon('marker-icon-2x-green.png'),
  restaurant_german: createIcon('marker-icon-2x-green.png'),
  restaurant_mexican: createIcon('/marker-icon-2x-green.png'),
  restaurant_italian: createIcon('/marker-icon-2x-green.png'),
  restaurant_asian: createIcon('/marker-icon-2x-green.png'),
  restaurant_portugese: createIcon('marker-icon-2x-green.png'),
  restaurant_arabian: createIcon('marker-icon-2x-green.png'),
  shishabar: createIcon('marker-icon-2x-red.png'),
  teehouse: createIcon('marker-icon-2x-orange.png'),
  vine: createIcon('marker-icon-2x-orange.png'),
  misc: createIcon('marker-icon-2x-yellow.png')
};

// Erzeuge eine Map von Leaflet-Markern für WFS-Daten schwerpunkte_in_mainz
const markerMap2 = {  
  arts_centre: createIcon('marker-icon-grey.png'),
  attraction: createIcon('marker-icon-grey.png'),
  kindergarten: createIcon('marker-icon-violet.png'),
  park: createIcon('marker-icon-grey.png'),
  picnic_site: createIcon('marker-icon-grey.png'),
  pitch: createIcon('marker-icon-grey.png'),
  playground: createIcon('marker-icon-grey.png'),
  ruins: createIcon('marker-icon-grey.png'),
  school: createIcon('marker-icon-violet.png'),
  shelter: createIcon('marker-icon-grey.png'),
  sports_centre: createIcon('marker-icon-grey.png'),
  stadium: createIcon('marker-icon-violet.png'),
  swimming_pool: createIcon('marker-icon-grey.png'),
  theatre: createIcon('marker-icon-violet.png'),
  track: createIcon('marker-icon-grey.png'),
  university: createIcon('marker-icon-violet.png'),
  viewpoint: createIcon('marker-icon-grey.png'),
  zoo: createIcon('marker-icon-grey.png'),
  "\"Pois_in_Mainz_zu_Punkten_fclass\"is \"": createIcon('marker-icon-grey.png')
};


//################### Karte zusammenstellen ########################################

// Zeige Karte, Marker und Datenpunkte
function showMapAndMarker() {

  //################### Grundkarte ################################################
  // Erzeuge die Karte und fülle das HTML-Element
  if (!map) {
    const mapEl = document.getElementById('myMap'); // Initiierung der Map
    
    map = L.map(mapEl, {
      center: [49.99859468665215, 8.267035467126759],  // Koordinate im Zentrum
      zoom: 12        // Anzahl der aufgerufenen Kacheln
    });

    // Setze Grundkarte OSM
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // // onClick-Events auf der Karte werden angezeigt
    // let clickMarker = null;
    // map.on('click', (e) => {
    //   console.log('[showMapAndMarker] Angeklickte Koordinaten: ' +
    //     e.latlng.lat + ', ' + e.latlng.lng);

    //   if (clickMarker) {
    //     map.removeLayer(clickMarker);
    //   }
    //   clickMarker = L.marker([e.latlng.lat, e.latlng.lng], 
    //     {draggable: true} // Verschiebbar
    //   ).addTo(map);
    //   console.log('Angeklickte Koordinaten: ' + e.latlng.lat + ', ' + e.latlng.lng);
    //   document.getElementById('longitude').value = e.latlng.lng;
    //   document.getElementById('latitude').value = e.latlng.lat;
    // });

  }
  
  // // Zuerst alle vorhandenen Marker löschen
  // map.eachLayer(layer => {
  //   if (layer instanceof L.Marker) {
  //     map.removeLayer(layer);
  //   }
  // });

  L.marker([49.99900612182232, 8.269902960248576], {
    clickable: true,
    icon: altstadt_icon,
    title: 'Altstadt',
  }).bindPopup('<b>ALTSTADT</b>').openPopup().addTo(map);

  //Routing mit Altstadt-Punkt als Zentrum
  // map.on('click', function(e){
  //   L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
 
  //   L.Routing.control({
  //     waypoints:[
  //       L.latLng(49.99900612182232, 8.269902960248576),
  //       L.latLng(e.latlng.lat, e.latlng.lng)
  //     ],
  //     routeWhileDragging: true,
  //     serviceUrl: 'http://localhost:53000/'
  //   });
  // });
  
  //############################ Kartenelemente für SQlite-Daten erstellen ####################################################################

  // Erzeuge neue Marker mit Popups für alle Café-POIs 
  let features = [];
  for (const poi of cardPoiList) {
    let marker = new L.marker([poi.latitude, poi.longitude], {
      clickable: true,
      icon: markerMap[poi.type],
      title: poi.name,
    }).bindPopup('<b>' + poi.name + '</b>')
      .addTo(map);
    features.push(marker);
  }
  
  // Zoome die Map auf die Features der Liste
  if (features.length > 0) {
    var group = new L.featureGroup(features);
    map.fitBounds(group.getBounds());
  }
 
  let center;
  let cafeIcon = createIcon('marker-icon-2x-black.png');
  if (position=getUserCoordinates()) {
    center = position;
  } else {
    center = map.getCenter();
  }

  //######################################### OverpassAPI #######################################################

  // if (map.hasLayer(opls)) {  
  //   map.removeLayer(opls);
  // }
  
  // Query für OverpassAPI Buslinien
  const overpassQueryBuslanes = 'way({{bbox}})["highway"="busway"];out qt;'; //{{style:node["route"="tram"]{color: red; width: 4; opacity: 1;}}}

  let opls = {
    
    'Tram':  new L.OverPassLayer({      
      'query':'node({{bbox}})["railway"="tram_stop"];out qt;',//{{style:node["railway"="tram_stop"]{fill-color: blue; color: blue; fill-opacity: 1;}}}',
      'opacity': 0.7,
      'attribution': attr_overpass      
    }),

    'Bus':   new L.OverPassLayer({      
      'query':'(node({{bbox}})["highway"="bus_stop"];);out qt;',//{{style:node["highway"="bus_stop"]{fill-color: red; color: red; fill-opacity: 1;}}}',
      'opacity': 0.7
    }),

    'Barrieren': new L.OverPassLayer({      
      'query':'node({{bbox}})["amenity"="recycling"]',
      'opacity': 0.7
    }),

    // Versuch, ein Styling zu setzen
    // 'Cafe|Restaurant': new L.OverPassLayer({
    //     query: 'node({{bbox}})[amenity~"restaurant|cafe"];out qt;',
    //     opacity: 0.7,
        // Diese Funktion wird aufgerufen, wenn die Daten geladen sind
        // onSuccess: function(data) {
        //     // Hier kannst du die Stile definieren
        //     L.geoJSON(data, {
        //         pointToLayer: function (feature, latlng) {
        //             let style;
        //             if (feature.properties.tags.amenity === 'restaurant') {
        //                 style = { color: 'green', fillColor: 'green' };
        //             } else if (feature.properties.tags.amenity === 'cafe') {
        //                 style = { color: 'black', fillColor: 'black' };
        //             }
        //             return L.circleMarker(latlng, {
        //                 radius: 8,
        //                 fillColor: style.fillColor,
        //                 color: style.color,
        //                 weight: 1,
        //                 opacity: 1,
        //                 fillOpacity: 0.8
        //             });
        //         }
        //     });
        // }
    // }),
    
    'Cafe|Restaurant': new L.OverPassLayer({      
      'query':'(node({{bbox}})[amenity~"restaurant|cafe"];);out qt;',//{{style:node[amenity=restaurant] {color: green; fill-color: green;} node[amenity=cafe] {color: darkviolet; fill-color: darkviolet;}}}',
      'opacity': 0.7
    }),

	  //#################### Markercluster-Groups code by Gimhan Wijayawardana in OverpassAPI ##########################     

    'Weitere Cafés': new L.OverPassLayer({
      minZoom: 15,
      endPoint: 'https://overpass-api.de/api/',
      query: 'node(around:5000.0,' + center.lat + ',' + center.lng + ')["amenity"="cafe"];out;',
      onSuccess: function(data=cafePoiList) {
        let grupo= new L.markerClusterGroup({ showCoverageOnHover: true, disableClusteringAtZoom:17 });
        for(i=0;i<data.elements.length;i++) {
            e = data.elements[i];
            let pos = new L.LatLng(e.lat, e.lon);
            console.info(e.tags);
            L.marker(pos,{
              icon:cafeIcon,
              title:e.tags.name, //Restautrantnamen
              tipus:e.tags.amenity 
            }).on('click', markerOnClick).addTo(grupo); //Marker werden Clustergruppen zugeordnet
        }
        map.addLayer(grupo); //to add the cluster to the map
        function markerOnClick(event){
          let restaurante = event.target.options.tipus + " "
          +event.target.options.title;
          window.open('https://www.google.com/?q='+restaurante,
          '_blank');
        }
      },
      minZoomIndicatorOptions: { //Anzeige, ab welchem Zoomlevel Daten sichtbar sind
        position: 'topright',
        minZoomMessage: 'Current zoom level: CURRENTZOOM - All data at level: MINZOOMLEVEL'
      }
    })
  }

//#################################### Control für Bedienung ############################################################

  L.control.layers(baseMaps, opls).addTo(map);  
  //L.wmsLegend(uri);
  
} // Funktion Ende




//############################### Button für Anzeige von Pois in Karte #################################################################

// Funktion für einen Button, mit dem ein Punkt in der Karte angezeigt wird
function buttonMarker(lat, lon, name) {
  //document.getElementById('addMarkerButton').addEventListener('click', function() {
  // Ersetze diese Koordinaten mit deinen tatsächlichen Koordinaten.
  let latitude = lat;
  let longitude = lon;

  // Erstelle einen Marker mit den gegebenen Koordinaten.
  let marker = L.marker([latitude, longitude]).addTo(map);

  // Optional: Füge ein Popup zum Marker hinzu.
  marker.bindPopup("Location ist hier: " + name + ".").openPopup();
  //});
}


//############## Kartenelemente für WFS  erstellen #######################################################################

//Funktion, um Karte zusammenzustellen
function showMapAndMarkersForWfs(){
  // Erzeuge neue Marker mit Popups für alle POIs aus dem WFS
  let pois_features = [];  
  const poisMap = cafePoiList;
  let i = 0;
  // map.eachLayer(layer => {
  //   if (layer instanceof L.Marker) {
  //     map.removeLayer(layer);
  //   }
  // });
    
  poisMap.forEach(markersForWfs);  

  function markersForWfs(item, index) {
    const meanx = item.properties.MEAN_Y;
    const meany = item.properties.MEAN_X;   
    let marker2;   
          
    marker2 = new L.marker([meanx, meany], {
      clickable: true,
      icon: markerMap2[item.properties.Pois_in_Mainz_zu_Punkten_fclass],
      title: item.properties.Pois_in_Mainz_zu_Punkten_name!="Name unbekannt"?(item.properties.Pois_in_Mainz_zu_Punkten_name + 
        ", " + item.properties.Pois_in_Mainz_zu_Punkten_fclass):item.properties.Pois_in_Mainz_zu_Punkten_fclass,
      opacity: 0.5
    }).bindPopup('<b>' + index + ': ' + item.properties.Pois_in_Mainz_zu_Punkten_fclass + ', ' + 
      item.properties.Pois_in_Mainz_zu_Punkten_name + '</b>')
      .addTo(map);
    pois_features.push(marker2);
  }

  // Zoome die Map auf die Features der Liste
  if (pois_features.length > 0 && pois_features.length == cafePoiList.length) {
    let group2 = new L.featureGroup(pois_features);
    map.fitBounds(group2.getBounds());
  }
}
