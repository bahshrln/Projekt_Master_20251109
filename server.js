import express from 'express';
import logger from 'morgan';
import livereload from 'livereload';
import connectLiveReload from 'connect-livereload';
import restApi from './rest-api.js';

// Erzeuge Express-Objekt
const ex = express();
// Server soll Seite bei Änderungen automatisch im Browser neu laden
const liveReloadServer = livereload.createServer();
liveReloadServer.server.once('connection', () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
ex.use(connectLiveReload());

// Server soll mit JSON umgehen können
ex.use(express.json());

// Server verwendet einen Logger, um Ergebnisse von Requests anzuzeigen
ex.use(logger('dev'));

// Stellt alle Dateien unter public bereit
ex.use(express.static('public'));

// Stellt eine REST-API unter /locations zur Verfügung, um auf die Datenbank
// zugreifen zu können
ex.use('/persona', restApi);

// Setze den Port und erzeuge den Server
const port = 53000;
const server = ex.listen(port, () => {
  console.log(`[server.js] Express-Server läuft auf http://localhost:${port}`);
});