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
import ImageWMS from 'ol/source/ImageWMS';

useGeographic();
var sirinaDiva = "500px";
var idObjekta = 0;

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


var wmsLayer = new ImageLayer({
  title: "Žbunje",
  name: "zbunje",
  source: new ImageWMS({
    url: wmsUrl,
    params: {
      LAYERS: "winsoft:zbunje_v"
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
  console.log(wmsLayer.getSource().getLegendUrl());
  var url = wmsLayer.getSource().getFeatureInfoUrl(evt.coordinate, map.getView().getResolution(), "EPSG:4326", {
    INFO_FORMAT: "application/json"
  });
  if (url) {
    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (json) {
        let odgovor = JSON.parse(json);
        if (odgovor.features.length > 0) {
          popuniKontrole(odgovor);
        }
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

function popuniKontrole(odgovor) {
  var atributi = odgovor.features[0]["properties"];
  console.log("atributi", atributi);
  idObjekta = atributi["id"];
  document.querySelector("#latinskiNaziv").value = atributi["latinski_naziv"];
  document.querySelector("#narodniNaziv").value = atributi["narodni_naziv"];
  for (var i = 0; i < document.querySelector("#tip").length; i++) {
    document.querySelector("#tip").options[i].text === atributi["tip"] && (document.querySelector("#tip").options[i].selected = true);
  }
  document.querySelector("#zdravstvenoStanje").value = atributi["zdravstveno_stanje"];
  document.querySelector("#napomena").value = atributi["napomena"];
  //slika
  var slika = atributi["url_fotografije"];
  slika.length && (slika = slika.substring(slika.lastIndexOf("/") + 1, slika.length));
  //overlay.getElement().innerHTML = '<a target="_blank" href="' + imageUrl + slika + '"><img src="' + imageUrl + slika + '"></a>';

}


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