import "ol/ol.css";
import { Map, View } from "ol/index";
import GeoJSON from "ol/format/GeoJSON";
import { Modify, Select, Draw, Snap } from "ol/interaction";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { useGeographic } from "ol/proj";

useGeographic();

console.log(location.origin);

/*document.querySelector("#podloga_osm").addEventListener("click", alert("osm"));
document.querySelector("#podloga_topo").addEventListener("click", alert("topo"));
document.querySelector("#podloga_satelit").addEventListener("click", alert("satelit"));
document.querySelector("#podloga_osm").innerHTML = "";*/
/*document.querySelector("#podloga_topo").click(functon() {
  alert("topo");
});*/

document.querySelector("#pan").addEventListener("click", pan);
document.querySelector("#odaberi").addEventListener("click", odaberi);
document.querySelector("#dodaj").addEventListener("click", dodaj);
document.querySelector("#izbrisi").addEventListener("click", izbrisi);
document.querySelector("#izmijeni").addEventListener("click", izmijeni);
document.querySelector("#atributi").addEventListener("click", atributi);
document.querySelector("#marker").addEventListener("click", marker);
document.querySelector("#pretraga").addEventListener("click", pretraga);
document.querySelector("#podloga_osm").addEventListener("click", pan);
document.querySelector("#podloga_topo").addEventListener("click", pan);

var source = new VectorSource({
  url: "http://localhost/gis/staze.geojson",
  //url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
  format: new GeoJSON(),
});

var map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({
      source: source,
    }),
  ],
  view: new View({
    center: [19.2629, 42.43862],
    zoom: 18,
  }),
});

var select = new Select();

var modify = new Modify({
  features: select.getFeatures(),
});

var draw = new Draw({
  type: "Polygon",
  source: source,
});

var snap = new Snap({
  source: source,
});

function removeInteractions() {
  map.removeInteraction(modify);
  map.removeInteraction(select);
  map.removeInteraction(draw);
  map.removeInteraction(snap);
}

var mode = document.getElementById("mode");

function onChange() {
  removeInteractions();
  switch (mode.value) {
    case "draw": {
      map.addInteraction(draw);
      map.addInteraction(snap);
      break;
    }
    case "modify": {
      map.addInteraction(select);
      map.addInteraction(modify);
      map.addInteraction(snap);
      break;
    }
    default: {
      // pass
    }
  }
}
mode.addEventListener("change", onChange);
onChange();

function pan() {
  console.log("PAN");
}

function odaberi() {
  console.log("ODABERI");
}

function dodaj() {
  console.log("DODAJ");
}

function izbrisi() {
  console.log("IZBRISI");
}

function izmijeni() {
  console.log("IZMIJENI");
}

function atributi() {
  console.log("atributi");
}

function atributi() {
  console.log("atributi");
}

function marker() {
  console.log("marker");
  document.getElementById("pretragaDiv").style.width = "250px";
}

function pretraga() {
  console.log("pretraga");
  //document.getElementById("pretragaDiv").style.width = "0";
  closeDiv("#pretragaDiv");
}
