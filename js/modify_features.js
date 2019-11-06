import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import {
  defaults as defaultInteractions,
  Modify,
  Select
} from 'ol/interaction';
import {
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer';
import {
  OSM,
  Vector as VectorSource
} from 'ol/source';


var raster = new TileLayer({
  source: new OSM()
});

var vector = new VectorLayer({
  source: new VectorSource({
    url: 'data/countries.geojson',
    format: new GeoJSON(),
    wrapX: false
  })
});

var select = new Select({
  wrapX: false
});

var modify = new Modify({
  features: select.getFeatures()
});

var map = new Map({
  interactions: defaultInteractions().extend([select, modify]),
  layers: [raster, vector],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});