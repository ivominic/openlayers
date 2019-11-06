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

var source = new VectorSource({
  url: 'data/countries.geojson',
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
    center: [0, 0],
    zoom: 2
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

var mode = "draw"

function onChange() {
  removeInteractions();
  switch (mode) {
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
/*mode.addEventListener('change', onChange);*/
onChange();