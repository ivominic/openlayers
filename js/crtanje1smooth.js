import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer';
import {
  OSM,
  Vector as VectorSource
} from 'ol/source';
import Draw from 'ol/interaction/Draw';

import smooth from 'chaikin-smooth';

function makeSmooth(path, numIterations) {
  numIterations = Math.min(Math.max(numIterations, 1), 10);
  while (numIterations > 0) {
    path = smooth(path);
    numIterations--;
  }
  return path;
}

var vectorSource = new VectorSource({});

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
      opacity: 0.9
    }),
    new VectorLayer({
      source: vectorSource
    })
  ],
  target: 'map',
  view: new View({
    center: [1078373.5950, 6871994.5910],
    zoom: 5
  })
});

var shallSmoothen = true;
var numIterations = 10;

var draw = new Draw({
  source: vectorSource,
  type: 'LineString'
});
map.addInteraction(draw);
draw.on('drawend', function (event) {
  if (!shallSmoothen) {
    return;
  }
  var feat = event.feature;
  var geometry = feat.getGeometry();
  var coords = geometry.getCoordinates();
  var smoothened = makeSmooth(coords, numIterations);
  geometry.setCoordinates(smoothened);
});