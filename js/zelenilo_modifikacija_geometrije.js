import 'ol/ol.css';
import {
  Map,
  View
} from 'ol/index';
import GeoJSON from 'ol/format/GeoJSON';
import {
  Modify,
  Select,
  Draw,
  Snap
} from 'ol/interaction';
import {
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer';
import {
  OSM,
  Vector as VectorSource
} from 'ol/source';
import {
  useGeographic
} from 'ol/proj';

useGeographic();

console.log(location.origin);

var source = new VectorSource({
  url: 'http://localhost/gis/staze.geojson',
  //url: 'https://openlayers.org/en/latest/examples/data/geojson/countries.geojson',
  format: new GeoJSON()
});

var map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new VectorLayer({
      source: source
    })
  ],
  view: new View({
    center: [19.2629, 42.43862],
    zoom: 18
  })
});

var select = new Select();

var modify = new Modify({
  features: select.getFeatures()
});

var draw = new Draw({
  type: 'Polygon',
  source: source
});

var snap = new Snap({
  source: source
});

function removeInteractions() {
  map.removeInteraction(modify);
  map.removeInteraction(select);
  map.removeInteraction(draw);
  map.removeInteraction(select);
}

var mode = document.getElementById('mode');

function onChange() {
  removeInteractions();
  switch (mode.value) {
    case 'draw': {
      map.addInteraction(draw);
      map.addInteraction(snap);
      break;
    }
    case 'modify': {
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
mode.addEventListener('change', onChange);
onChange();

var pomocna;
select.on('select', function (e) {
  pomocna = e;
  console.log(e.selected[0].getProperties()["id"]);
  // document.getElementById('status').innerHTML = '&nbsp;' +
  //     e.target.getFeatures().getLength() +
  //     ' selected features (last operation selected ' + e.selected.length +
  //     ' and deselected ' + e.deselected.length + ' features)';
});