import "ol/ol.css";
import {
  Map,
  View
} from "ol/index";
import GeoJSON from "ol/format/GeoJSON";
import {
  Modify,
  Select,
  Draw,
  Snap
} from "ol/interaction";
import {
  Tile as TileLayer,
  Vector as VectorLayer,
  Image as ImageLayer
} from "ol/layer";
import {
  OSM,
  Vector as VectorSource
} from "ol/source";
import {
  useGeographic
} from "ol/proj";
import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';
import WMSGetFeatureInfo from 'ol/format/WMSGetFeatureInfo';

useGeographic();
var sirinaDiva = "500px";

console.log(location.origin);

var urlOrigin = "http://localhost";
var urlServer = "http://167.172.171.249";
var wmsUrl = urlOrigin + "/geoserver/winsoft/wms";
var imageUrl = urlServer + "/slike/";


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

document.querySelector("#btnSacuvaj").addEventListener("click", sacuvaj);
document.querySelector("#btnPonisti").addEventListener("click", ponisti);
document.querySelector("#btnFilter").addEventListener("click", filtriranje);
document.querySelector("#btnIzbrisi").addEventListener("click", brisanje);

var source = new VectorSource({
  url: "http://localhost/gis/staze.geojson",
  //url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
  format: new GeoJSON(),
});


var wmsTileLayer = new TileLayer({
  source: new TileWMS({
    url: wmsUrl,
    params: {
      'LAYERS': 'winsoft:zbunje',
      'TILED': false
    },
    serverType: 'geoserver',
    crossOrigin: 'anonymous'
  })
});


var wmsLayer = new ImageLayer({
  title: "Žbunje",
  name: "zbunje",
  source: new ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "winsoft:zbunje"
    },
    ratio: 1,
    serverType: "geoserver"
  })
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
    wmsLayer
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
var tipAkcije = "info";



function onChange() {
  removeInteractions();
  switch (tipAkcije) {
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
    case "info": {
      /*console.log("aaaaaa");
      map.addInteraction(select);
      select.on('select', function (e) {
        console.log("info", e.coordinate)
        console.log("prvo", e.target.getFeatures().getLength());
        console.log("drugo", e.selected.length);
        console.log("trece", e.deselected.length);
        var urlLejer = wmsLayer.getSource().getGetFeatureInfoUrl(coordinate, map.getView().getResolution(), "EPSG:3857", {
          INFO_FORMAT: "application/json"
        });
        if (urlLejer) {
          fetch(urlDrvece)
            .then(function (response) {
              //restartovanje();
              return response.text();
            })
            .then(function (json) {
              let odgovor = JSON.parse(json);
              if (odgovor.features.length > 0) {
                popuniKontrole("drvece", odgovor);
              }
            });
        }
      });*/
      break;
    }
    default: {
      // pass
    }
  }
}
mode.addEventListener("change", onChange);
onChange();

map.on('singleclick', function (evt) {
  //var viewResolution = /** @type {number} */ (view.getResolution());
  var url = wmsLayer.getSource().getGetFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), "EPSG:3857", {
    INFO_FORMAT: "application/json"
  });
  if (url) {
    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        console.log("html", html);
      });
  }
});

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.forEachLayerAtPixel(pixel, function () {
    return true;
  });
  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

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

function marker() {
  console.log("marker");
  document.getElementById("pretragaDiv").style.width = sirinaDiva;
}

function pretraga() {
  console.log("pretraga");
  //document.getElementById("pretragaDiv").style.width = "0";
  closeDiv("#pretragaDiv");
}

function sacuvaj() {
  console.log("sacuvaj");
}

function ponisti() {
  console.log("ponisti");
}

function filtriranje() {
  console.log("filtriranje");
}

function brisanje() {
  console.log("brisanje");
}