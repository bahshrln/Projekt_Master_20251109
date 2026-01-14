# Projektarbeit
Britta Herhaus
Matr.-Nr. 950313
Projekt: Cafes in Mainz

# Aufgabe:
Suchen Sie sich einen Topic, den Sie kreativ darstellen möchten
Haltestellen, POIs, Restaurants, Verteilung Arbeitslose, Altersstruktur, Ärzte, E Mobilität ... Eigene Ideen?
Ihr Prototyp Web Client darf die folgenden Anforderungen erfüllen:
Teil Homburg
Mind. 2 Baselayer , z.B. OpenStreetMap, RLP Geoportal WMS
Mind. 3 Overlays von Ihrem WMS , z.B. Straßen, POIs, Landnutzung mit eigenem Styling Ihrer Layer
Ein Overpass API Layer, z.B. Pubs oder Haltestellen
Ein Diagramm mit Highcharts
Ein WFS Layer von OGC Features API (mittels Docker Container) oder vom eigenen Web Service
Teil Heidrich
Serverseitige Komponente zur Bereitstellung von Diagrammdaten aus Datenbank
AJAX basierte Interaktive Komponente
Präsentation Ihres Topics mit Umsetzung der Ergebnisse @ 05.07.2025
Beschreibung des Sachverhalts
Entwurfsentscheidungen des Map/Web Client, Server Komponente
Live Demo?
Kritische Diskussion Ihrer Ergebnisse

# Express Webserver

Web-Server mit Express.js (https://expressjs.com/de/)
Datenbank SQLite (https://www.sqlite.org/) 
Node-Module sqlite3 (https://www.sqlitetutorial.net/sqlite-nodejs/).


## Inhalte des Verzeichnisses "Projekt_Cafes_in_Mainz_neu"
- .vscode
- node_modules
-public // enthält alle Skripte und statischen Dateien wie HTML, CSS, JS, Bilder, JSON, etc.
  - public\css
    - public\css\css // Verzeichnis für fontawesome-CSS
    - public\css\webfonts // Verzeichnis für fontawesome-Icons
    public\css\cards.css
    public\css\dashboard-styles.css
    public\css\highcharts.css
    public\css\map.css
    public\css\MarkerCluster.css
    public\css\MarkerCluster.Default.css
    public\css\nav.css
    public\css\OverPassLayer.css
    public\css\OverPassLayer.css.map
  - public\dist
    public\dist\leaflet-routing-machine-3.2.12
    public\dist\leaflet.markercluster-src copy.js
    public\dist\leaflet.markercluster-src.js
    public\dist\leaflet.markercluster-src.js.map
    public\dist\leaflet.markercluster.js
    public\dist\MarkerCluster.css
    public\dist\MarkerCluster.Default.css
  - public\img // Verzeichnis aller verwendeten Icons und Bilder
  - public\js
    public\js\highchart.js
    public\js\layer_to_display.js
    public\js\leaflet_overpass_layer.js
    public\js\OverPassLayer.bundle.js
    public\js\OverPassLayer.bundle.js.map
    public\js\wfs.js
  public\cafe_module.css // Skript zum Import aller CSS-Module
  public\cafe_module.js // Skript zum Import aller JS-Module
  public\dashboard-data.js
  public\dashboard-leaflet.js
  public\index.html
  public\locations_geo_bearb.json
  .gitignore
  locations_geo_bearb.csv
  locations.db // SQLite-Datenbank mit eigenen erfassten Daten für die Anwendung
  package-lock.json
  package.json // Konfigurationsdatei
  rest-api.js // enthält Schnittstellen zur DB: GET, INSERT und UPDATE
  server.js // Webserver-Startskript
 

#####################################################################################################################
## Aufsetzen des Projektes // (Prof. Dr. J. Heidrich)

- `npm install`: Installiert alle Node-Module aus `package.json`
- `npm run start`: Startet den Webserver und öffnet automatisch ein Browserfenster mit den Inhalten
- `npm run dev`: Startet den Webserver mit nodemon für die Entwicklung, d.h., wenn sich Dateien ändern, dann wird der Server automatisch neu gestartet
- `npm run devOpen`: Wie `npm run dev` plus dass zusätzlich die Startseite des Servers automatisch im Browser geöffnet wird

**Hinweis:** `npm` muss im Wurzelverzeichnis der Anwendung ausgeführt werden! (Dort wo `package.json` liegt.)


#####################################################################################################################
# Geoserver

Für die Anwendung muss zugleich der Geoserver gestartet werden, damit die Dienste WFS und WMS zur Verfügung stehen.



#####################################################################################################################

Für das Projekt wurden folgende Dienste erstellt:

1. Es werden Daten in einer SQlite3-Datenbank zur Verfügung gestellt: selbst erfasste Daten zu Cafes in Mainz. Quellen waren
    - gelbe Seiten
    - die eigenen Webseiten der Cafes
    - Folgende Kategorien wurden berücksichtigt: neben Cafes auch Bars, Lounges, Biergärten und Restaurants, die bei Suchen auch unter Cafes zu finden sind.

2. Open Data Rheinland-Pfalz und Hessen, die für WMS und WFS-Dienste verwendet wurden.
    - Baselayer: OSM, Esri, Stadia_alidade
    - WFS: Darstellung von Gebäuden in Mainz als Schwerpunkte in Mainz aus den Daten Buildings Hessen und Rheinland-Pfalz, umgewandelt von Polygonen in jeweils eine einzelne Schwerpunktkoordinate
    - WMS: Darstellung grüner Punkte bzw. Freizeitpunkte in Mainz aus den Layern Landuse und Natural für Hessen und Rheinland-Pfalz, davon ausgeschnitten der Bereich um Mainz. Auch für Strände und Parkplätze sowie Parkhäuser aus diesen Layern entnommen.
    - Overpass-Layer: Nutzung von OSM-Daten zur Darstellung von Bus- und Bahnhaltestellen sowie weiterer Cafes und Restaurants.

3. Umsetzung:
    - Existierende Punkte: werden als Startseite in Form einer Liste von Cards ausgegeben, die auf die jeweilige Detailseite verlinken
    - Cafe ansehen: wird nur über die Cards aufgerufen (Button 'View')
    - Cafe ändern: wird ebenfalls über die Cards aufgerufen (Button 'Edit')
    - Highcharts Cafés: zeigt ein Chart mit besonderen Angeboten der Cafes kategorisiert nach Typen der Orte.
    - Weitere Karten: zeigt die Daten aus dem WFS zusätzlich als Cards an.


4. Das Konzept setzt die Idee um, einen schnellen Überblick über Ausgehmöglichkeiten und Treffpunkte zu geben. Die Cafes sollten sich an Orten finden lassen, wo das Leben der Leute stattfindet, d.h. es wird nach Cafes in der Nähe des jeweiligen Lebensmittelpunktes gesucht. Studierende suchen in der Nähe ihres Campus, Nachtschwärmer in der Innenstadt, Familien mit Kindern in der Nähe von Parks und Spielplätzen. Bei besonders schönem Wetter suchen alle Zielgruppen Parks und Grünflächen auf, zielgruppenspezifisch kann aber auch nach anderen Freizeitmöglichkeiten geschaut werden: Museen, Sportanlagen, Kino, Fahrradverleih, Camping.
Es werden häufig Freizeitangebote mit anschließenden Treffen verbunden, so dass das Umfeld von Cafes eine genauso große Bedeutung hat wie das kulinarische und zusätzliche Angebot, was wiederum den Cards-Ansichten und der Detailseite jedes Cafes entnommen werden kann. Die Darstellung von Bus- und Bahnhaltestellen sowie Parkmöglichkeiten ist ein zusätzlicher Service, um Cafes besuchen zu können.

5. Ausbaufähig ist das Erweitern der Daten für eine möglichst hohe Vollständigkeit. Die ergänzenden Cafedaten aus anderen Layern könnten dann wegfallen. Dafür könnten noch mehr und detaillierter die Angebote der Cafes und Freizeiangebote rund um die Cafes erfasst werden. Das Ziel war ursprünglich, die Nähe der Cafes zu Grünflächen und Gewässern aufzuzeigen und deren Möglichkeiten, draußen zu sitzen, die Sonne und eine grüne Umgebung zu genießen. Erfasst werden könnte zusätzlich die Entfernung zur Innenstadt und zu den öffentlichen Verkehrsmitteln, so dass kürzeste Wege gleich zu erkennen sind.


# Quellen: 

# Basemaps:
Stefan Seelmann (2013-2025):"leaflet-extras /leaflet-providers - An extension to Leaflet that contains configurations for various free tile providers.", URL: https://github.com/leaflet-extras/leaflet-providers and https://leaflet-extras.github.io/leaflet-providers/preview/

über: Lucas Andión (in: medium.com, 24.08.2020): "Use Maps from any Provider in React - How to use OpenStreetMap, MapBox, HERE, Bing, and other maps inside your React app.", URL: https://medium.com/trabe/use-maps-from-any-provider-using-react-7a0b61a24b4b

# Overlays, Markerlayer:
Volodymyr Agafonkin(2025, Hg. OpenStreetMaps Contributors): "Leaflet - an open-source JavaScript library for mobile-friendly interactive maps", URL: https://leafletjs.com

# Daten:
Geofabrik GmbH and OpenStreetMap Contributors(2018): "OpenStreetMap Data Extracts", URL: https://download.geofabrik.de/

Geofabrik GmbH and OpenStreetMap Contributors (2018): "Download OpenStreetMap data for this region: Hessen", URL: https://download.geofabrik.de/europe/germany/hessen.html

Geofabrik GmbH and OpenStreetMap Contributors (2018): "Download OpenStreetMap data for this region: Rheinland-Pfalz", URL: https://download.geofabrik.de/europe/germany/rheinland-pfalz.html

# Overpass-API:
OpenStreetMap Foundation, Partner Deutschland FOSSGIS e.V. (2025): "DE:Map Features", URL: https://wiki.openstreetmap.org/wiki/DE:Map_Features

# Overpass-Layer:
Amat Guillaume (auf: GitHub, Inc., 2025): "Leaflet OverPass Layer", URL: https://github.com/GuillaumeAmat/leaflet-overpass-layer

# Hilfsmittel, Tutorials:
https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_API_by_Example

GuillaumeAmat (auf github.com, 01.03.2022): "Leaflet OverPass Layer", URL: https://github.com/GuillaumeAmat/leaflet-overpass-layer

Gimhan Wijayawardana(in: medium.com, 22.10.2022): "Map clustering with Leaflet", URL: https://gimhan-wijayawardana.medium.com/map-clustering-with-leaflet-8a01dbf9376

Eliana Rubíes (in: medium.com, 28.02.2020): "Create a map with leaflet and Overpass API", URL: https://medium.com/@elianarubies/create-a-map-with-leaflet-and-overpass-api-6286814bad4b

Free Raster Tile Basemaps in MapLibre No keys required:
https://codepen.io/g2g/embed/rNRJBZg?
über: 
Garret K. (in: medium.com, 30.01.2024): "Free Basemap Tiles for MapLibre and MapBox", URL: https://medium.com/@go2garret/free-basemap-tiles-for-maplibre-18374fab60cb 

Esri Deutschland GmbH (in: ArcGIS Online - Reference, 2025): "FAQ/General - Can I use ArcGIS Online for free?", URL: https://doc.arcgis.com/en/arcgis-online/reference/faq.htm#:~:text=Yes%2C%20if%20it%20is%20for,GIS%20users%20around%20the%20world.

Tim Sutton (2014): "kartoza / leaflet-wms-legend", URL: https://github.com/kartoza/leaflet-wms-legend
über:
Geographic Information Systems (2015): "How to add WMS legend in leaflet from Geoserver?", URL: https://gis.stackexchange.com/questions/182770/how-to-add-wms-legend-in-leaflet-from-geoserver


# Bilder:
@freepik, <a href="https://www.vecteezy.com/free-vector/coffee-cup">Coffee Cup Vectors by Vecteezy</a>


