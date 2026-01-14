// Setze globale Variablen 
let cardProbandenList = []; // Daten aus der Datenbank
let cardPoiList = []; // Daten aus der Datenbank
let cafePoiList = []; // Daten aus einem WFS
let cafe_id = 0;      // Id für die Übertragung aus der Card-Ansicht in die View-Ansicht
let person_id = 0     // Id für die Übertragung aus der Card-Ansicht in die View-Ansicht
let person_id_up = 0     // Id für die Übertragung aus der Card-Ansicht in die View-Ansicht
let person_data_up = [];   // Speicher für einzelnen Datensatz aus der Datenbank für UPDATE-Funktion
let cafe_id_up = 0;   // Id für die Übertragung aus der Card-Ansicht in die Edit-Ansicht
let cafe_data = [];   // Speicher für einzelnen Datensatz aus der Datenbank
let cafe_data_up = [];   // Speicher für einzelnen Datensatz aus der Datenbank für UPDATE-Funktion
let form = '';        // HTML, das dynamisch erstellt und eingesetzt wird zum Bearbeiten von Datensätzen
let userLongitude = 0.0; // Speicher für User-Koordinaten
let userLatitude = 0.0;  // Speicher für User-Koordinaten
let i = 0;
//let wfs_url = 'http://localhost:8080/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=britta:schwerpunkte_in_mainz_epsg_4326&outputFormat=application/json';

// Map, welche Typ-IDs auf Klartextnamen abbildet
/* const typeMap = {
  "bar": "Bar",
  "biergarten": "Biergarten",
  "bistro": "Bistro",
  "brauhaus": "Brauhaus",
  "cafe": "Café",
  "cafe_mensa": "Mensa-Café",
  "cafe_scand": "Skandinavisches Café",
  "coffeeshop": "Coffeeshop",
  "internet_cafe": "Internetcafé",
  "cocktailbar": "Cocktailbar",
  "friseur": "Friseur-Lounge",
  "grill": "Grill",
  "kneipe": "Kneipe",
  "lounge": "Lounge",
  "nightclub": "Nachtklub",
  "restaurant": "Restaurant",
  "restaurant_german": "Deutsche Küche",
  "restaurant_mexican": "Mexikanische Küche",
  "restaurant_italian": "Italienische Küche",
  "restaurant_asian": "Asiatische Küche",
  "restaurant_portugese": "Portugiesische Küche",
  "restaurant_arabian": "Arabische Küche",
  "shishabar": "Shisha-Bar",
  "teehouse": "Teehaus",
  "vine": "Weinlokal",
  "misc": "Sonstiges"
};
 */
// Bestimmen der aktuellen Position und abspeichern nach userLongitude
// und userLatitude
function getUserCoordinates() {
  if ("geolocation" in navigator) {
    console.log('The browser supports Geolocation');
  } else {
    console.log('The browser does not support Geolocation');
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('[getUserLocation] Position des Nutzers:', position.coords);
      userLongitude = position.coords.longitude;
      userLatitude = position.coords.latitude;
      document.getElementById('userCoordinates').innerHTML = "(" +
        userLongitude + ", " + userLatitude + ")";
    }, error => {
      if (error.code === error.POSITION_UNAVAILABLE) {
        console.warn('Position unbekannt, versuche es später erneut.');
      } else {
        console.error('Geolocation-Fehler:', error.message);
      }
    });
  }
}

// Einlesen vorhandener POIs über URL, abspeichern nach poiList
// und Anzeigen auf Seite
function getData(url) {
  fetch(url).then(response => {
    // Analysiere die Response und frage JSON-Daten an
    console.log('[getData] Response vom Server:', response);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Daten');
    }
    return response.json();
  }).then(data => {
    // Aktualisiere poiList mit den Daten aus JSON und zeige sie auf der Seite an
    console.log('[getData] JSON-Daten vom Server:', data); 
    cardPoiList = data; //Daten enthalten alle Daten aus der Datenbank locations.db und der Tabelle locations_geo_bearb
    updateCard();
  }).catch(error => {
    console.error('[getData] Fehler:', error);
  });
}

// Einlesen vorhandener POIs über eine URL, abspeichern nach poiList
// und Anzeigen in Tabelle
function getDataWfs(url) {
  fetch(url).then(response => {
    // Analysiere die Response und frage JSON-Daten an
    console.log('[getData] Response vom Wfs-Server:', response);
    if (!response.ok) {
      throw new Error('Fehler beim Laden der Daten');
    }
    return response.json();
  }).then(data => {
    // Aktualisiere poiList mit den Daten aus JSON und zeige Tabelle an
    console.log('[getData] JSON-Daten vom Wfs-Server:', data); 
    cafePoiList = data; //Daten enthalten alle Daten aus dem WFS Schwerpunkte in Mainz, die Daten enthalten Spielplätze, Grünflächen, Sportzentren und Restaurants
    cafePoiList = cafePoiList.features;
    updateCardGoals();
  }).catch(error => {
    console.error('[getData] Fehler:', error);
  });
}

//Einlesen von Daten aus einem WFS für die Seite weitere Vorschläge
function getLocationsFromWfsJson() {
  console.log('[getLocationsFromWfsJson] Laden aus WFS');
  const wfs = document.getElementById('cafePoiList').value;
  getDataWfs(wfs_url);
}

// Einlesen vorhandener POIs aus JSON-Datei auf Server 
function getDemografieFromFile() { //vorher getLocationsFromFile
  console.log('[getDemografieFromJson] Laden aus JSON-Datei');  
  getData('./demografie.json');
}

// Einlesen vorhandener POIs aus Datenbank auf Server 
function getDemografie() { // vorher getLocations
  console.log('[getDemografie] Laden aus Datenbank über REST')
  const searchString = document.getElementById('search').value;
  if (searchString != '') {
    console.log('[getDemografie] Suche nach String:', searchString);
  }
  getData(`/locations/?search=${searchString}`);
}

// Holen der Suchbegriffe
/* function getDemografieExtended() { // vorher getLocationsExtended
  console.log('[getDemografieExtended] Laden aus Datenbank über REST')
  const searchName = document.getElementById('searchPerson').value;
  const searchType = document.getElementById('searchType').value;
  const searchStreet = document.getElementById('searchStreet').value;
  const searchPlz = document.getElementById('searchPlz').value;
  const searchCity = document.getElementById('searchCity').value;
  const searchVegan = document.getElementById('searchVegan').checked?1:'';
  const searchGlutenfree = document.getElementById('searchGlutenfree').checked?1:'';
  const searchBreakfast = document.getElementById('searchBreakfast').checked?1:'';
  const searchLgbtq = document.getElementById('searchLgbtq').checked?1:'';
  const searchEvents = document.getElementById('searchEvents').checked?1:'';
  const searchHappyhour = document.getElementById('searchHappyhour').checked?1:'';
  const searchOutside = document.getElementById('searchOutside').checked?1:'';
  console.log('[getLocations] Suche nach Name:', searchName, 
    'Suche nach Art:', searchType, 'Suche nach Straße:', 
    searchStreet, 'Suche nach PLZ:', searchPlz, 'Suche nach Ort:', 
    searchCity, 'Suche nach Vegan:', searchVegan, 'Suche nach Glutenfrei:', 
    searchGlutenfree, 'Suche nach Frühstück:', searchBreakfast, 'Suche nach LGBTQ:', 
    searchLgbtq, 'Suche nach Events:', searchEvents, 'Suche nach Happy Hour:', 
    searchHappyhour, 'Suche nach Außengastro:', searchOutside );
  getData(`/locations/?searchName=${searchName}&searchType=${searchType}&searchStreet=${searchStreet}&searchPlz=${searchPlz}&searchCity=${searchCity}&searchVegan=${searchVegan}&searchGlutenfree=${searchGlutenfree}&searchBreakfast=${searchBreakfast}&searchLgbtq=${searchLgbtq}&searchEvents=${searchEvents}&searchHappyhour=${searchHappyhour}&searchOutside=${searchOutside}`);
} */

function getSingleLocation(searchId) {
  console.log('[getDemografieExtended] Laden aus Datenbank über REST')
  console.log('[getDemografie] Suche nach Id:', searchId);
  getData(`/locations/?id=${searchId}`);
}

// Zurücksetzen der Datenbank auf dem Server, d.h., befüllen der Datenbank
// mit Beispieldaten
function resetDemografie() {
  console.log('[resetDemografie] Zurücksetzen der Datenbank über REST')
  getData(`/locations/reset`);
}

// Löschen der Datenbank auf dem Server und leeren der Variable poiList
function deleteDemografie() {
  fetch('/locations',
    { method: 'DELETE' }).then(response => {
      // Analysiere die Response und frage JSON-Daten an
      if (!response.ok) {
        throw new Error('Fehler beim Löschen der Daten');
      }
      return response.json();
    }).then(data => {
      console.log('[deleteDemografie] Nachricht zum Löschen über REST:', data);
      getLocations();
    }).catch(error => {
      console.error('[deleteDemografie] Fehler:', error);
    });
}


//################ TAB VIEW ##################################################
// Einzelnen Datensatz ansehen mit dynamisch erstelltem HTML
function getDataPerson(person_id) { //getDataPoi
  setOldData(person_id);
  let poi = cafe_data;
  //console.log("poi.vegan: "+poi.vegan + poi.id);
  console.log("[getDemografie :"+ getDemografie(poi.Person));
  document.getElementById("viewPoi").innerHTML = `
  <h1>${poi.Person} ${poi.Letter} ${poi.Datum}</h1>
    <div class="type">
      <p>Bildungsabschluss (höchster erreichter Schul- bzw. Hochschulabschluss): ${poi.vereinheitlicht}</p>
      <p>Gelerneter Beruf: ${poi.gelernterBeruf}</p>
      <p>Ausgeübter Beruf: ${poi.ausgeübterBeruf}</p>
      <p>Ausgeübter Beruf: ${poi.GesamtdauerderErwerbstätigkeit}</p>
    </div> 
    <div>
      <p>Alter: ${poi.Alter}</p>
      <p>Geschlecht: ${poi.Geschlecht}</p>
      <p>Familienstand: ${poi.Familienstand}</p>
    </div>    
    <div>
      <p>PLZ und Ort: ${poi.Wohnort}</p>
      <p>Wohnart: ${poi.Wohnart}</p> 
      <p>Wohndauer: ${poi.Wohndauer}</p> 
      <p>Haushaltsgröße: ${poi.Haushaltsgröße}</p>  
    </div>
    <div>    
      <p>Lieblingsfarbe: ${poi.Lieblingsfarbe}</p> 
      <p>Einrichtungsstil: ${poi.Einrichtungsstil}</p> 
      <p>Mediennutzung: ${poi.Mediennutzung}</p> 
      <p>Musik, Literatur: ${poi.MusikLiteratur}</p>        
    </div>
    <div>    
      <p>Gesundheit und Einschränkung: ${poi.GesundheitundEinschränkung}</p> 
      <p>Bevorzugte Mobilität: ${poi.BevorzugteMobilität}</p> 
      <p>Mobilitätsarten: ${poi.Mobilitätsarten}</p> 
      <p>Wege und Ziele inkl. Häufigkeit: ${poi.WegeundZieleHäufigkeit}</p>
      <p>Reisen: ${poi.Reisen}</p> 
      <p>Mobilitätsarten vor 10 Jahren: ${poi.Mobilitätsartenvor10Jahren}</p>         
    </div>
     <div>    
      <p>Hobbys, Ehrenamt, Freizeigestaltung: ${poi.HobbysEhrenamtFreizeigestaltung}</p> 
      <p>Konzerte, Theater, Veranstaltungen: ${poi.KonzerteTheaterVeranstaltungen}</p> 
      <p>Freunde, Nachbarn: ${poi.FreundeNachbarn}</p> 
      <p>Sport und Bewegung: ${poi.SportundBewegung}</p>
      <p>Konsum: ${poi.Konsum}</p> 
      <p>Lebensmotto: ${poi.Lebensmotto}</p>         
    </div>
  `;
}

function setOldData(old_data_id) {   // einzelne Id, die benötigt wird, aus dem Gesamtdatensatz einen einzelnen herauszufiltern
  let i = 0;
  
  let l_id = old_data_id;
  for (const poi of cardPoiList) {  // cardPoiList ist globale Variable mit den gespeicherten Daten aus der Datenbank, über die Schleife wird ein Einzeldatensatz gefiltert

    if (poi.id == l_id) {
      cafe_data = poi;              // globale Variable wird mit einzelnem Datensatz gefüllt
      person_id = poi.id;             // globale Variable wird mit der Id eines einzelnen Datensatzes gefüllt
      console.log(cafe_data.name + "+" + poi.name);
    } else {
      console.log("error oldData" + poi.id + "+" + l_id); //Fehlermeldung, wenn Daten nicht vorhanden sind
    }
  }
}

//#################### setValues für UPDATE-Funktion ##################

/* function setData(ind) { // Funktion, um einzelnen Datensatz zu speichern und im Formular zum Editieren anzuzeigen, ind ist die benötigte Einzel-Id
  //let poi = [];
  let index = ind;
  console.log("[setData] person_data_up: " + ind);
  for(const poi of cardPoiList) {

    if(poi.id == index) {
      person_data_up = poi;
      person_id_up = poi.id;
      console.log(person_data_up.name + "+" + poi.name);
    } else {
      console.log("error UpdateData" + poi.id + "+" + index); //Fehlermeldung, wenn Daten nicht vorhanden sind
    }
  }     
  setValues(person_data_up);                7
}


function setValues(poi) {  // Funktion für dynamisch erstelltes HTML, um ein Formular mit Daten zum Bearbeiten anzuzeigen
  let old_data = poi;
  console.log("[setValues for Location to edit]: " + old_data.name );   

  document.getElementById("poiInfo").innerHTML =                        // dynamisch erstelltes HTML
`   <div class="poiInput">
      <div>        
        <p>Name:</p>
        <p><input type="text" value="${old_data.name}" id="up_name"></p>
      </div>
      <div>
        <p>Label für Typ: </p>
        <p><input type="text" value="${old_data.type_label}" id="up_type_label"></p>
        <p>Typ:</p>
        <p><select id="up_type"> Typ: 
            <option value="bar" selected="${old_data.type == "bar"?selected ='selected':selected=''}">Bars</option>
            <option value="biergarten"${old_data.type == "biergarten"?selected ='selected':selected=''}>Biergärten</option>
            <option value="bistro" ${old_data.type == "bistro"?selected ='selected':selected=''}>Bistros</option>
            <option value="brauhaus" ${old_data.type == "brauhaus"?selected ='selected':selected=''}>Brauhäuser</option>
            <option value="cafe"${old_data.type == "cafe"?selected ='selected':selected=''}>Cafés</option>
            <optgroup id="sub_type_cafe">
              <option value="cafe_mensa" ${old_data.type == "cafe_mensa"?selected ='selected':selected=''}>Mensa</option>
              <option value="cafe_scand" ${old_data.type == "cafe_scand"?selected ='selected':selected=''}>Skandinavisch</option>
              <option value="coffeeshop" ${old_data.type == "coffeshop"?selected ='selected':selected=''}>Coffeeshop</option>
              <option value="internet_cafe" ${old_data.type == "internet_cafe"?selected ='selected':selected=''}>Internetcafés</option>
            </optgroup>                                 
            <option value="cocktailbar"${old_data.type == "cocktailbar"?selected ='selected':selected=''}>Cocktailbars</option>
            <option value="friseur" ${old_data.type == "friseur"?selected ='selected':selected=''}>Friseur-Lounges</option>
            <option value="grill" ${old_data.type == "grill"?selected ='selected':selected=''}>Grills</option>
            <option value="kneipe" ${old_data.type == "kneipe"?selected ='selected':selected=''}>Kneipen</option>
            <option value="lounge" ${old_data.type == "lounge"?selected ='selected':selected=''}>Lounges</option>            
            <option value="nightclub" ${old_data.type == "nightclub"?selected ='selected':selected=''}>Nachtclubs</option>            
            <option value="restaurant" ${old_data.type == "restaurant"?selected ='selected':selected=''}>Restaurants</option>              
            <optgroup id="sub_type_restaurant">
              <option value="restaurant_german" ${old_data.type == "restaurant_german"?selected ='selected':selected=''}>Deutsche Küche</option>
              <option value="restaurant_mexican" ${old_data.type == "restaurant_mexican"?selected ='selected':selected=''}>Mexikanische Küche</option>
              <option value="restaurant_italian" ${old_data.type == "restaurant_italian"?selected ='selected':selected=''}>Italienische Küche</option>
              <option value="restaurant_asian" ${old_data.type == "restaurant_asian"?selected ='selected':selected=''}>Asiatische Küche</option>
              <option value="restaurant_portugese" ${old_data.type == "restaurant_portugese"?selected ='selected':selected=''}>Portugiesische Küche</option>
              <option value="restaurant_arabian" ${old_data.type == "restaurant_arabian"?selected ='selected':selected=''}>Arabische Küche</option>
            </optgroup>                
            <option value="shishabar" ${old_data.type == "shishabar"?selected ='selected':selected=''}>Shishabars</option>
            <option value="teehouse" ${old_data.type == "teehouse"?selected ='selected':selected=''}>Teehäuser</option>
            <option value="vine" ${old_data.type == "vine"?selected ='selected':selected=''}>Weinlokal</option>
            <option value="misc" ${old_data.type == "misc"?selected ='selected':selected=''}>Sonstiges</option>
          </select>
        </p>
      </div>
      <div>
        <label for="street">Straße: </label>
        <input type="text" value="${old_data.street}" id="up_street">
      </div>
      <div>
        <p><label for="city">PLZ und Ort: </label></p>   
      </div>
      <div class="cell_row">        
        <input class="cell" maxlength="5" type="text" value="${old_data.plz}" id="up_plz"><input class="cell" type="text" value="${old_data.city}" id="up_city">      
      </div>
      <div>
        <p><label for="tel">Telefon: </label></p>        
        <p><input type="tel" value="${old_data.tel}"  id="up_tel"></p>
      </div>
      <div>
        <p><label for="distance">Entfernung zur Altstadt: </label></p>
        <p><input type="text" placeholder="Entfernung zur Altstadt" value="${old_data.distance}" id="up_distance"></p>
      </div>
      <div>
        <table id="up_tab_open">
          <tr>
            <td  colspan="3">Öffnungszeiten:</td>
          </tr>
          <tr>
            <th>Wochentag</th><th>geöffnet ab</th><th>schließt um</th>
          </tr>
          <tr>
            <td>Montag</td><td><input type="text" placeholder="00:00" value="${old_data.moopen}" id="up_moopen"></td><td><input type="text" placeholder="00:00" value="${old_data.moclosed}" id="up_moclosed"></td>
          </tr>
          <tr> 
            <td>Dienstag</td><td><input type="text" placeholder="00:00" value="${old_data.diopen}" id="up_diopen"></td><td><input type="text" placeholder="00:00" value="${old_data.diclosed}" id="up_diclosed"></td>
          </tr>
          <tr>
            <td>Mittwoch</td><td><input type="text" placeholder="00:00" value="${old_data.miopen}" id="up_miopen"></td><td><input type="text" placeholder="00:00" value="${old_data.miclosed}" id="up_miclosed"></td>
          </tr>
          <tr>
            <td>Donnerstag</td><td><input type="text" placeholder="00:00" value="${old_data.doopen}" id="up_doopen"></td><td><input type="text" placeholder="00:00" value="${old_data.doclosed}" id="up_doclosed"></td>
          </tr>
          <tr>
            <td>Freitag</td><td><input type="text" placeholder="00:00" value="${old_data.fropen}" id="up_fropen"></td><td><input type="text" placeholder="00:00" value="${old_data.frclosed}" id="up_frclosed"></td>
          </tr>
          <tr>
            <td>Samstag</td><td><input type="text" placeholder="00:00" value="${old_data.saopen}" id="up_saopen"></td><td><input type="text" placeholder="00:00" value="${old_data.saclosed}" id="up_saclosed"></td>
          </tr>
          <tr>
            <td>Sonntag</td><td><input type="text" placeholder="00:00" value="${old_data.soopen}" id="up_soopen"></td><td><input type="text" placeholder="00:00" value="${old_data.soclosed}" id="up_soclosed"></td>
          </tr>
        </table>
      </div>
      <div>
        <p><h4>Auf einen Blick: </h4l></p>
      </div>
      <div>
        <p>Beschreibung:</p>
        <p><textarea id="up_description">"${old_data.description}</textarea></p>
      </div>
      <div>
          <p><label for="online">Online: </label></p>
          <p><input type="online" placeholder="www.beispiel.com" value="${old_data.online}" id="up_online"></p>
      </div>
      <table>
        <tr>
          <th class="left"><label for="latitude">Breitengrad: </label></th><th class="left"><label for="longitude">Längengrad: </label></th>
        </tr>
        <tr></tr>
          <td><input type="text" value="${old_data.latitude}" maxlength="10" id="up_latitude"></td><td><input type="text" maxlength="10" value="${old_data.longitude}" id="up_longitude"></td>
        </tr>
      </table>
      <div>
        <h2>Besondere Angebote: </h2>  
      </div>          
      <div>
        <input type="checkbox" id="up_vegan" name="vegan" value="vegan" ${old_data.vegan==1?"checked":""}>
        <label for="vegan"> Veganes Angebot</label><br>
        <input type="checkbox" id="up_glutenfree" name="glutenfree" value="glutenfree" ${old_data.glutenfree==1?"checked":""}>
        <label for="glutenfree"> Glutenfreies Angebot</label><br>
        <input type="checkbox" id="up_breakfast" name="breakfast" value="breakfast" ${old_data.breakfast==1?"checked":""}>
        <label for="breakfast"> Frühstücksangebot</label><br>
        <input type="checkbox" id="up_lgbtq" name="lgbtq" value="lgbtq" ${old_data.lgbtq==1?"checked":""}>
        <label for="lgbtq"> LGBTQ-Angebote</label><br>
        <input type="checkbox" id="up_events" name="events" value="events" ${old_data.events==1?"checked":""}>
        <label for="events"> Event-Angebote (Konzert, Lesung, Vortrag, Live-Musik u.ä.)</label><br>
        <input type="checkbox" id="up_happyhour" name="happyhour" value="happyhour" ${old_data.happyhour==1?"checked":""}>
        <label for="happyhour"> Happy Hour-Angebote</label><br>
        <input type="checkbox" id="up_outside" name="outside" value="outside" ${old_data.outside==1?"checked":""}>
        <label for="outside"> Außengastro</label><br><br>
      </div>           
    </div>
    <div class="actions">
      <input type="button" value="Aktualisieren" onclick="updateLocation(${old_data.id})">
    </div>
  `;
} */

/* async function updateLocation(person_id_up) {
  let p_id = person_id_up;
 
  // Datensatz mit aktualisierten Daten
  let poi = {
    name: document.getElementById('up_name').value,
    type: document.getElementById('up_type').value,
    type_label: document.getElementById('up_type_label').value,
    street: document.getElementById('up_street').value,
    plz: document.getElementById('up_plz').value,
    city: document.getElementById('up_city').value,
    distance: document.getElementById('up_distance').value,
    moopen: document.getElementById('up_moopen').value,
    moclosed: document.getElementById('up_moclosed').value,
    diopen: document.getElementById('up_diopen').value,
    diclosed: document.getElementById('up_diclosed').value,
    miopen: document.getElementById('up_miopen').value,
    miclosed: document.getElementById('up_miclosed').value,
    doopen: document.getElementById('up_doopen').value,
    doclosed: document.getElementById('up_doclosed').value,
    fropen: document.getElementById('up_fropen').value,
    frclosed: document.getElementById('up_frclosed').value,
    saopen: document.getElementById('up_saopen').value,
    saclosed: document.getElementById('up_saclosed').value,
    soopen: document.getElementById('up_soopen').value,
    soclosed: document.getElementById('up_soopen').value,
    description: document.getElementById('up_description').value.replace("\"", ""), //textarea fügt Anführungszeichen hinzu, die gelöscht werden müssen
    tel: document.getElementById('up_tel').value,
    online: document.getElementById('up_online').value,
    longitude: document.getElementById('up_longitude').value,
    latitude: document.getElementById('up_latitude').value,
    vegan: document.getElementById('up_vegan').checked,
    glutenfree: document.getElementById('up_glutenfree').checked,
    breakfast: document.getElementById('up_breakfast').checked,
    lgbtq: document.getElementById('up_lgbtq').checked,
    events: document.getElementById('up_events').checked,
    happyhour: document.getElementById('up_happyhour').checked,
    outside: document.getElementById('up_outside').checked
  }

  */
  
//####################### API-Aufruf ###############################

  /* console.log("[person_id und name für UPDATE]" + person_id_up + "" + person_data_up.name);  
  
  const data = JSON.stringify(poi); // Aktualisierte Daten werden von JS-Objekt in Zeichenfolge konvertiert
  console.log('[updateLocation] POI aktualisieren:', data);
  await fetch(`/locations/?id=${person_id_up}`, { // id der zu aktualisierenden Datei für DB-Abfrage
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },                     // Versenden der Daten
    body: data
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Fehler beim Aktualisiseren des Eintrags. HTTP status: ${response.status}`);
    }
    return response.json();
  }).then(data => {
    for (data_obj in data) {
      //console.log(data_obj.id, data_obj.name, data_obj.type);
      if(data_obj.id==p_id){
        console.log("Daten: " + data + "|" + data.id + "|" + data.name);
      }
    }
      
    console.log('[updateLocation] Eintrag erfolgreich aktualisisert:', data);
    // Lese aktuelle Datenbank-Inhalte wieder ein und zeige geänderte Daten
    getDemografie(); 

    // Aktualisiere die Map und die Tabelle
    updateCard();
  }).catch(error => {
    console.error('[updateLocation] Fehler:', error);
  });
}*/

// ###################### NEW POI #########################################
// Übermittele die Daten für einen POI an den Datenbank auf dem Server
/* async function postNewLocation() {
  // Erzeugen eines Objektes, welches alle Daten eines POI enthält
  let post_poi = {
    name: document.getElementById('name').value,
    type: document.getElementById('type').value,
    type_label: document.getElementById('type_label').value,
    street: document.getElementById('street').value,
    plz: document.getElementById('plz').value,
    city: document.getElementById('city').value,
    distance: document.getElementById('distance').value,
    moopen: document.getElementById('moopen').value,
    moclosed: document.getElementById('moclosed').value,
    diopen: document.getElementById('diopen').value,
    diclosed: document.getElementById('diclosed').value,
    miopen: document.getElementById('miopen').value,
    miclosed: document.getElementById('miclosed').value,
    doopen: document.getElementById('doopen').value,
    doclosed: document.getElementById('doclosed').value,
    fropen: document.getElementById('fropen').value,
    frclosed: document.getElementById('frclosed').value,
    saopen: document.getElementById('saopen').value,
    saclosed: document.getElementById('saclosed').value,
    soopen: document.getElementById('soopen').value,
    soclosed: document.getElementById('soclosed').value,
    description: document.getElementById('description').value.replace("\"", ""),
    tel: document.getElementById('tel').value,
    online: document.getElementById('online').value,
    longitude: document.getElementById('longitude').value,
    latitude: document.getElementById('latitude').value,
    Shape: 'Punkt',
    vegan: (document.getElementById('vegan').checked==true?true:false),
    glutenfree: (document.getElementById('glutenfree').checked==true?true:false),
    breakfast: (document.getElementById('breakfast').checked==true?true:false),
    lgbtq: (document.getElementById('lgbtq').checked==true?true:false),
    events: (document.getElementById('events').checked==true?true:false),
    happyhour: (document.getElementById('happyhour').checked==true?true:false),
    outside: (document.getElementById('outside').checked==true?true:false)
  };

  // Setze Werte, falls keine Angaben gemacht wurden
  if (post_poi.name == '') post_poi.name = 'Unbekannt';
  if (post_poi.type == '') post_poi.type = 'misc';
  if (post_poi.type_label == '') post_poi.type_label = 'Sonstiges';
  if (post_poi.street == '') post_poi.street = '';
  if (post_poi.plz == '') post_poi.plz = '';
  if (post_poi.city == '') post_poi.city = '';
  if (post_poi.distance == '') post_poi.distance = '';
  if (post_poi.moopen == '') post_poi.moopen = '';
  if (post_poi.diopen == '') post_poi.diopen = '';
  if (post_poi.miopen == '') post_poi.miopen = '';
  if (post_poi.doopen == '') post_poi.doopen = '';
  if (post_poi.fropen == '') post_poi.fropen = '';
  if (post_poi.saopen == '') post_poi.saopen = '';
  if (post_poi.soopen == '') post_poi.soopen = '';
  if (post_poi.moclosed == '') post_poi.moclosed = '';
  if (post_poi.diclosed == '') post_poi.diclosed = '';
  if (post_poi.miclosed == '') post_poi.miclosed = '';
  if (post_poi.doclosed == '') post_poi.doclosed = '';
  if (post_poi.frclosed == '') post_poi.frclosed = '';
  if (post_poi.saclosed == '') post_poi.saclosed = '';
  if (post_poi.soclosed == '') post_poi.soclosed = '';  
  if (post_poi.description == '') post_poi.description = 'ohne Beschreibung';
  if (post_poi.tel == '') post_poi.tel = '';
  if (post_poi.online == '') post_poi.online = ''; 

  // Nimm die eigene Position, wenn keine angegeben wurde
  if (post_poi.longitude == '' || post_poi.latitude == '') {
    post_poi.longitude = userLongitude;
    post_poi.latitude = userLatitude;
  }
  if (post_poi.Shape == '') post_poi.Shape = 'Punkt';
  if (post_poi.vegan == '') post_poi.vegan = false;
  if (post_poi.glutenfree == '') post_poi.glutenfree = false;
  if (post_poi.breakfast == '') post_poi.breakfast = false;
  if (post_poi.lgbtq == '') post_poi.lgbtq = false;
  if (post_poi.events == '') post_poi.events = false;
  if (post_poi.happyhour == '') happyhour.lgbtq = false;
  if (post_poi.outside == '') post_poi.outside = false;
  
  // Ergebnis ausgeben:
  var outputString = '';
  outputString = 'Danke für den neuen post_poi: "' + post_poi.name + '" (' +
    typeMap[post_poi.type] + ') an Position ' + post_poi.longitude + '/' + post_poi.latitude;
  document.getElementById('result').innerHTML = outputString;

  // Aufruf der REST-Schnittstelle, um Daten zu schreiben
  const data = JSON.stringify(post_poi);
  console.log('[postNewLocation] Neuen POI hinzufügen:', data);
  await fetch('/locations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: data
  }).then(response => {
    if (!response.ok) {
      throw new Error('Fehler beim Hinzufügen des Eintrags');
    }
    return response.json();
  }).then(data => {
    console.log('[postNewLocation] Eintrag erfolgreich hinzugefügt:', data);

    // Lese aktuelle Datenbank-Inhalte wieder ein
    // (sollte um den neuen POI ergänzt worden sein)
    getLocations();

    // Aktualisiere die Map und die Tabelle
    updateCard();
  }).catch(error => {
    console.error('[postNewLocation] Fehler:', error);
  });
} */


//################## CARD-LAYOUT ###############

// Zeigt eine Tabelle mit allen Einträgen der Datenbank an
// sowie die aktuelle Karte mit Markern
function updateCard() {
  console.log('[updateCard] Aktualisiere die Card im HTML');

  // Füge eine Tabelle mit den geladenen POIs hinzu
  let card = '';
  let card2 = '';
  let avatar = '';
  let id = 0;
 
  // Füge eine Zeile pro POI hinzu
  for (const poi of cardPoiList) {

    let l_id = poi.Person;
    //avatar = poi.avatar;
    if (avatar == '') {
      avatar = './img/avatar_cafes.png'; // Hier könnte noch ein Bild geladen werden
    }
    card += getCardRow([      
      "<div class=\"card\">" +
      " <img src=" + avatar + " alt=\"Avatar\" style=\"width:100%\">" +
      " <div class=\"container\">" + "<h4>" + poi.Person + "</h4>" +
      "  <p>" + poi.longitude + ", " + poi.latitude + "</p>" +
      "  <p>" + poi.gelernterBeruf + "</p>" +
      " </div>" +
      " <div class=\"actions\">" +
      "  <input type=\"button\" class=\"ico_btn_view\" id=\"" + l_id + "poi_bearbeiten\" value=\"Edit\" onclick = \"openTab('updatePoi');setData(" + l_id + ");\">" +
      "  <input type=\"button\" class=\"ico_btn_edit\" id=\"" + l_id + "poi_ansehen\" value=\"View\" onclick = \"openTab('viewPoi');getDataPoi(" + l_id + ");\">" +      
      " </div>" +
      "</div>"
    ]);
  }

  // Überschreibe die Inhalte im div
  const divList = document.getElementById('cardPoiList');
  divList.innerHTML = card ;


  // const cafesPois = cafePoiList; 

  // cafesPois.forEach(notIterable);

  // const divWfs = document.getElementById('cafePoiList');
  // divWfs.innerHTML = "<div style='width:100%;'><h1>Vorschläge für Ziele in der Umgebung</h1></div>" + card2;

  // function notIterable(item, index) {

  //   if (item.properties.Pois_in_Mainz_zu_Punkten_name==null){
  //     item.properties.Pois_in_Mainz_zu_Punkten_name='Name unbekannt';
  //   }
  //   card2 += getCardRow([      
  //     "<div class=\"card\">" +
  //     " <img src=\"" + avatar + "\" alt=\"Avatar\" style=\"width:100%\"></img>" +
  //     " <div class=\"container\">" + "<h4>" + index + ': ' + item.properties.Pois_in_Mainz_zu_Punkten_fclass + "</h4>" +
  //     "   <h3>" + (item.properties.Pois_in_Mainz_zu_Punkten_name) + "</h3>" +
  //     "   <p><input type=\"button\" value=\"Auf Map anzeigen\" id=\"addMarkerButton\" onclick=\"buttonMarker(" + item.properties.MEAN_Y + 
  //     ", "  + item.properties.MEAN_X + ", '" + (item.properties.Pois_in_Mainz_zu_Punkten_name!="Name unbekannt"?item.properties.Pois_in_Mainz_zu_Punkten_name:item.properties.Pois_in_Mainz_zu_Punkten_fclass) + "'" + ");\"></p>" +
  //     //"   <p>" + item.properties.MEAN_X + ", " + item.properties.MEAN_Y + "</p>" +
  //     " </div>" +
  //     "</div>"
  //   ]);
  // }

 
  //updateHighchart(cardPoiList);
  //}
  
  // Erzeugt eine Cardzeile pro Listenelement
  function getCardRow(cellCardList) {
    let rowCard = '';
    for (const cellCard of cellCardList) {
      rowCard += cellCard;
    }
    return rowCard;
  }
  // Zeige die Karte mit den Markern an
  if(i == 0) {
    showMapAndMarker();
    i++;
  }
    
}


function updateCardGoals() {
  let card2 = '';
  let avatar = '';
  const cafesPois = cafePoiList; 
  //avatar = poi.avatar;
  if (avatar == '') {
    avatar = './img/avatar_cafes.png'; // Hier könnte noch ein Bild geladen werden
  }

  cafesPois.forEach(notIterable);

  const divWfs = document.getElementById('cafePoiList');
  divWfs.innerHTML = "<div style='width:100%; text-align:center;'><h1>Vorschläge für Ziele in der Umgebung</h1>" + 
  "<input type=\"button\" value=\"Alle Ziele auf Map anzeigen\" id=\"addMarkersToMapButton\" onclick=\"showMapAndMarkersForWfs()\">" +
  "</div>" + card2;

  function notIterable(item, index) {

    if (item.properties.Pois_in_Mainz_zu_Punkten_name==null){
      item.properties.Pois_in_Mainz_zu_Punkten_name='Name unbekannt';
    }
    card2 += getCardRow([      
      "<div class=\"card\">" +
      " <img src=\"" + avatar + "\" alt=\"Avatar\" style=\"width:100%\"></img>" +
      " <div class=\"container\">" + "<h4>" + index + ': ' + item.properties.Pois_in_Mainz_zu_Punkten_fclass + "</h4>" +
      "   <h3>" + (item.properties.Pois_in_Mainz_zu_Punkten_name) + "</h3>" +
      "   <p><input type=\"button\" value=\"Auf Map anzeigen\" id=\"addMarkerButton\" onclick=\"buttonMarker(" + item.properties.MEAN_Y + 
      ", "  + item.properties.MEAN_X + ", '" + (item.properties.Pois_in_Mainz_zu_Punkten_name!="Name unbekannt"?item.properties.Pois_in_Mainz_zu_Punkten_name:item.properties.Pois_in_Mainz_zu_Punkten_fclass) + "'" + ");\"></p>" +
      " </div>" +
      "</div>"
    ]);
  }
   
  //updateHighchart(cardPoiList);
  //}

  // Erzeugt eine Cardzeile pro Listenelement
  function getCardRow(cellCardList) {
    let rowCard = '';
    for (const cellCard of cellCardList) {
      rowCard += cellCard;
    }
    return rowCard;
  }
  // Zeige die Karte mit den Markern an
  //showMapAndMarkersForWfs();
  }

