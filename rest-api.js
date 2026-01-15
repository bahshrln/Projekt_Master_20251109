import express from 'express';
import sqlite3 from 'sqlite3';
sqlite3.verbose();
import cors from 'cors'; // CORS-Middleware für expressjs
import fs from 'fs';

let corsOptions = {
  origin: 'http://localhost:53000',
  optionsSuccessStatus: 200 
}
//"C:\Users\britt\Documents\HS Mainz 2025\Projekt_Cafes_in_Mainz\Projekt_Cafes_in_Mainz_neu\locations.db"
//C:\Users\britt\Documents\HS Mainz 2025\Master\Projekt_Master_20251109\locations.db
// SQLite-Datenbankverbindung herstellen
const db = new sqlite3.Database('C:\Users\britt\Documents\HS Mainz 2025\Projekt_Cafes_in_Mainz\Projekt_Cafes_in_Mainz_neu\locations.db');

// Datenbanktabelle erstellen (falls sie noch nicht existiert)
if(!db) {
  db.run(`CREATE TABLE "Demografie" (
	"Person"	TEXT,
	"Letter"	TEXT,
	"Datum"	TEXT,
	"Haushaltsnetto"	TEXT,
	"Einkommensart"	TEXT,
	"Bildungsstand"	TEXT,
	"vereinheitlicht"	TEXT,
	"gelernterBeruf"	TEXT,
	"ausgeübterBeruf"	TEXT,
	"GesamtdauerderErwerbstätigkeit"	TEXT,
	"Alter"	TEXT,
	"Geschlecht"	TEXT,
	"Familienstand"	TEXT,
	"Wohnort"	TEXT,
	"Wohnart"	TEXT,
	"Wohndauer"	TEXT,
	"Haushaltsgröße"	TEXT,
	"Lieblingsfarbe"	TEXT,
	"Einrichtungsstil"	TEXT,
	"Mediennutzung"	TEXT,
	"MusikLiteratur"	TEXT,
	"GesundheitundEinschränkung"	TEXT,
	"BevorzugteMobilität"	TEXT,
	"Mobilitätsarten"	TEXT,
	"WegeundZieleinkl.Häufigkeit"	TEXT,
	"Reisen"	TEXT,
	"Mobilitätsartenvor10Jahren"	TEXT,
	"HobbysEhrenamtFreizeitgestaltung"	TEXT,
	"KonzerteTheaterVeranstaltungen"	TEXT,
	"FreundeNachbarn"	TEXT,
	"SportundBewegung"	TEXT,
	"Konsum"	TEXT,
	"Lebensmotto"	TEXT,
  PRIMARY KEY("Person")
  )`);
}

// Router erstellen für REST-Anfragen auf '/locations'
const restApi = express.Router();

// RESTful API Endpunkt, um alle Locations zu löschen
// restApi.delete('/', cors(corsOptions), (req, res) => {
//   console.log('[rest-api.js/delete] Datenbank wird gelöscht');
//   db.run('DELETE FROM Demografie', (err) => {
//     if (err) {
//       res.status(500).json({ error: err });
//     } else {
//       res.json({ message: 'Löschen aller Daten erfolgreich' });
//     }
//   });
// });

// RESTful API Endpunkt, um bestimmte Location mit id zu löschen
// restApi.delete('/id', cors(corsOptions), (req, res) => {
//   console.log(`[rest-api.js/delete] Eintrag ${id} wird gelöscht`);
//   const id = req.params.id;
//   db.run('DELETE FROM Demografie WHERE id=?', [id], (err) => {
//     if (err) {
//       res.status(500).json({ error: err });
//     } else {
//       res.json({ message: `Löschen von ${id} erfolgreich` });
//     }
//   });
// });



// RESTful API Endpunkt, um Location mit id zu lesen
// restApi.get(`/:id`, cors(corsOptions), (req, res) => {
//   const id = req.query.id;
//   console.log(`[rest-api.js/getId] Eintrag ${id} wird geholt`);  
//   if (id != null) {
//     db.all('SELECT * FROM Demografie WHERE id=?', [id], (err, rows) => {
//       if (err) {
//         res.status(500).json({ error: err });
//       } else {
//         console.log('[rest-api.js/getId] Datensatz mit id gelesen:', rows.length);
//         res.json(rows);
//       }
//   });
//   }
// });

  

// RESTful API Endpunkt, um Locations zu lesen
restApi.get('/', (req, res) => {
  const q = req.query;
  console.log('Query:', q);
  if (q && 'search' in q) {
    // Suche mit bestimmten Suchbegriff über Name und Beschreibung mit einer OR-Abfrage, die alles ausgibt mit dem Suchwort
    console.log('[rest-api.js/get] Suche Locations mit Suchstring:', q.search);
    db.all('SELECT * FROM Demografie WHERE ' +
      'Person LIKE ? OR Wohnort LIKE ? OR Geschlecht LIKE ? OR Familienstand LIKE ? '+
      'OR Alter LIKE ? OR Haushaltsgröße LIKE ? OR vereinheitlicht LIKE ? ORDER BY Person ASC', [
      `%${q.search}%`,`%${q.search}%`, `%${q.search}%`, 
      `%${q.search}%`, `%${q.search}%`, `%${q.search}%`, `%${q.search}%`
    ], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        console.log('[rest-api.js/get] Datensätze gelesen:', rows.length);
        res.json(rows);
      }
    });
    // Erweiterte Suche, die per AND-Abfrage nur die Ergebnisse ausgibt, die alle der eingegeben Suchfelder enthält 
  // } else if (q && 'searchName' in q && 'searchType' in q && 'searchStreet' in q && 'searchPlz' in q &&
  //   'searchCity' in q && 'searchVegan' in q && 'searchGlutenfree' in q && 
  //   'searchBreakfast' in q && 'searchLgbtq' in q && 'searchEvents' in q && 
  //   'searchHappyhour' in q && 'searchOutside' in q) {
  //   console.log('[rest-api.js/get] Suche Locations mit Namen:', q.searchName,
  //     'Art:', q.searchType, 'Straße:', q.searchStreet, 'PLZ:', q.searchPlz, 
  //     'Ort:', q.searchCity, 'Vegan:', q.searchVegan, 'Glutenfree:', q.searchGlutenfree, 
  //     'Frühstück:', q.searchBreakfast, 'LGBTQ:', q.searchLgbtq, 'Events:', q.searchEvents, 
  //     'Happy Hour:', q.searchHappyhour, 'Außengastro:', q.searchOutside);
  //   db.all('SELECT * FROM locations_geo_bearb WHERE name LIKE ? AND type LIKE ? ' +
  //     'AND street LIKE ? AND plz LIKE ? AND city LIKE ? ' + (q.searchVegan==1?'AND vegan = 1 ':'') 
  //     + (q.searchGlutenfree==1?'AND glutenfree = 1 ':'') + (q.searchBreakfast==1?'AND breakfast = 1 ':'') 
  //     + (q.searchLgbtq==1?'AND lgbtq = 1 ':'') + (q.searchEvents==1?'AND events = 1 ':'') 
  //     + (q.searchHappyhour==1?'AND happyhour = 1 ':'') + (q.searchOutside==1?'AND outside = 1 ':'') + 'ORDER BY name ASC', [
  //     `%${q.searchName}%`, `%${q.searchType}%`, `%${q.searchStreet}%`, 
  //     `%${q.searchPlz}%`, `%${q.searchCity}%`
  //   ], (err, rows) => {
  //     if (err) {
  //       res.status(500).json({ error: err });
  //     } else {
  //       console.log('[rest-api.js/get] Locations gelesen:', rows.length);
  //       res.json(rows);
  //     }
  //   });
  } else {
    // Gebe alle Locations zurück
    db.all('SELECT * FROM Demografie ORDER BY Person ASC', (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err });
      } {
        console.log('[rest-api.js/get] Alle Datensätze gelesen:', rows.length);
        res.json(rows);
      }
    });
  }
});

// RESTful API Endpunkt, um neue Location hinzuzufügen
// restApi.post('/', cors(corsOptions), (req, res) => {
//   const poi = req.body;
//   console.log('[rest-api.js/post] Neuer POI wird hinzugefügt:', poi);

  // Überprüfen, ob alle erforderlichen Daten vorhanden sind
  // if (!poi.name || !poi.type || !poi.type_label || !poi.street || !poi.plz || !poi.city || !poi.distance   //7
  //   || !poi.moopen || !poi.moclosed || !poi.diopen || !poi.diclosed || !poi.miopen      //5
  //   || !poi.miclosed || !poi.doopen || !poi.doclosed || !poi.fropen || !poi.frclosed    //5
  //   || !poi.saopen || !poi.saclosed || !poi.soopen || !poi.soclosed || !poi.description     //5
  //   || !poi.tel || !poi.online || !poi.longitude || !poi.latitude || !poi.Shape || !poi.vegan         //5
  //   || !poi.glutenfree || !poi.breakfast || !poi.lgbtq || !poi.events || !poi.happyhour //5
  //   || !poi.outside) {
  //   return res.status(400).json({ error: 'Fehlende Daten' });
  // }

  // Eintrag hinzufügen
//   db.run('INSERT INTO Demografie (name, type, type_label, street, plz, '+ //5
//     'city, distance, moopen, moclosed, diopen, diclosed, miopen, '+ //7
//     'miclosed, doopen, doclosed, fropen, frclosed, saopen, saclosed, '+  //7
//     'soopen, soclosed, description, tel, online, longitude, latitude, Shape, vegan, '+  //9
//     'glutenfree, breakfast, lgbtq, events, happyhour, outside) '+ //6
//     'VALUES '+
//     '(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '+
//     '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '+
//     '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '+
//     '?, ?, ?, ?)', [
//     poi.name, poi.type, poi.type_label, poi.street,
//     poi.plz, poi.city, poi.distance,
//     poi.moopen, poi.moclosed, poi.diopen,
//     poi.diclosed, poi.miopen, poi.miclosed,
//     poi.doopen, poi.doclosed, poi.fropen,
//     poi.frclosed, poi.saopen, poi.saclosed,
//     poi.soopen, poi.soclosed, poi.description,
//     poi.tel, poi.online, poi.longitude,
//     poi.latitude, poi.Shape, poi.vegan, poi.glutenfree,
//     poi.breakfast, poi.lgbtq, poi.events,
//     poi.happyhour, poi.outside
//   ], 
//   console.log( "POI neu: " + poi), (err) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     } else {
//       return res.json({ message: `Hinzufügen von '${poi.name}' erfolgreich` });
//     }
//   });
// });

// RESTful API Endpunkt, um existierende Location zu ändern
// restApi.put('/', (req, res) => {
//   const poi = req.body;
//   const poi_id = req.query.id; console.log("restApi PUT poi_id: " + poi_id);
  
//   console.log('[rest-api.js/put] Existierender POI wird geändert:', poi, poi_id);

  // Überprüfen, ob alle erforderlichen Daten vorhanden sind
  // if (!poi.name || !poi.type || !poi.type_label || !poi.street || !poi.plz || !poi.city || !poi.distance   //7
  //   || !poi.moopen || !poi.moclosed || !poi.diopen || !poi.diclosed || !poi.miopen      //5
  //   || !poi.miclosed || !poi.doopen || !poi.doclosed || !poi.fropen || !poi.frclosed    //5
  //   || !poi.saopen || !poi.saclosed || !poi.soopen || !poi.soclosed || !poi.description     //5
  //   || !poi.tel || !poi.online  || !poi.longitude || !poi.latitude || !poi.vegan         //5
  //   || !poi.glutenfree || !poi.breakfast || !poi.lgbtq || !poi.events || !poi.happyhour //5
  //   || !poi.outside) {
  //   return res.status(400).json({ error: 'Fehlende Daten' });
  // }

  // Eintrag ändern
//   db.run('UPDATE Demografie SET name=?, type=?, type_label=?, street=?, plz=?, '+                      //5
//     'city=?, distance=?, moopen=?, moclosed=?, diopen=?, diclosed=?, '+                 //6
//     'miopen=?, miclosed=?, doopen=?, doclosed=?, fropen=?, frclosed=?, '+               //6
//     'saopen=?, saclosed=?, soopen=?, soclosed=?, description=?, tel=?, online=?, '+         //7
//     'longitude=?, latitude=?, vegan=?, glutenfree=?, breakfast=?, lgbtq=?, events=?, '+ //7
//     'happyhour=?, outside=? WHERE id=?',                                                //2
//     [poi.name, poi.type, poi.type_label, poi.street,
//     poi.plz, poi.city, poi.distance,
//     poi.moopen, poi.moclosed, poi.diopen,
//     poi.diclosed, poi.miopen, poi.miclosed,
//     poi.doopen, poi.doclosed, poi.fropen,
//     poi.frclosed, poi.saopen, poi.saclosed,
//     poi.soopen, poi.soclosed, poi.description,
//     poi.tel, poi.online, poi.longitude, 
//     poi.latitude, poi.vegan, poi.glutenfree,
//     poi.breakfast, poi.lgbtq, poi.events,
//     poi.happyhour, poi.outside, poi_id], 
//       console.log('POI wird gesucht:', poi, poi_id), (err) => {
//       if (err) {
//         res.status(500).json({ error: err });
//       } else {
//         return res.json({ message: `Ändern von '${poi.name}' erfolgreich` });
//       }
//     });
// });

// RESTful API Endpunkt, um Datenbank zurückzusetzen und mit Beispieldaten
// zu befüllen
restApi.get('/reset', cors(corsOptions), (req, res) => {
  console.log('[rest-api.js/reset] Datenbank wird zurückgesetzt');

  // Lese lokale JSON-Datei als String und parse zum JS-Objekt
  const jsonFile = './public/demografie.json';
  const data = fs.readFileSync(jsonFile, 'utf8');
  const locations = JSON.parse(data);

  // Serialisiere die folgenden Schritte
  db.serialize(() => {
    // Lösche Datenbank-Tabelle
    db.run('DELETE FROM Demografie');

    // Bereite das Einfügen von Daten vor
    // const query = 'INSERT INTO locations_geo_bearb (name, type, type_label, street, '+                      //4
    // 'plz, city, distance, moopen, moclosed, diopen, diclosed, miopen, '+                  //8
    // 'miclosed, doopen, doclosed, fropen, frclosed, saopen, saclosed, soopen, '+           //8
    // 'soclosed, description, tel, online, longitude, latitude, vegan, glutenfree, '+           //8
    // 'breakfast, lgbtq, events, happyhour, outside) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?'+ //11
    // '?, ?, ?, ?, ?, ?, ?, ?, ?, ?,'+                                                      //10 
    // '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    // let insertStmt = db.prepare(query);

    // Iteriere durch die JSON-Daten und füge sie in die Datenbank ein
    Demografie.forEach(poi => {
      insertStmt.run([poi.Person, poi.Letter, poi.Datum, 
        poi.Haushaltsnetto, poi.Einkommensart, poi.Bildungsstand, 
        poi.vereinheitlicht, poi.gelernterBeruf, poi.ausgeübterBeruf, 
        poi.GesamtdauerderErwerbstätigkeit, poi.Alter, poi.Geschlecht, 
        poi.Familienstand, poi.Wohnort, poi.Wohnart, poi.Wohndauer, poi.Haushaltsgröße, 
        poi.Lieblingsfarbe, poi.Einrichtungsstil, poi.Mediennutzung, poi.MusikLiteratur, 
        poi.GesundheitundEinschränkung, poi.BevorzugteMobilität, poi.Mobilitätsarten, 
        poi.WegeundZieleinkl.Häufigkeit, poi.Reisen, poi.Mobilitätsartenvor10Jahren, 
        poi.HobbysEhrenamtFreizeitgestaltung, poi.KonzerteTheaterVeranstaltungen, 
        poi.FreundeNachbarn, poi.SportundBewegung, poi.Konsum, poi.Lebensmotto]);
    });

    // Schließe die vorbereitete Anweisung
    insertStmt.finalize();

    // Gebe zurückgesetzte Daten der DB zurück
    db.all('SELECT * FROM Demografie', (err, rows) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.json(rows);
      }
    });
  });
});

export default restApi;