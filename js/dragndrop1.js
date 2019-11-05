import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import {
  GPX,
  GeoJSON,
  IGC,
  KML,
  TopoJSON
} from 'ol/format';
import {
  defaults as defaultInteractions,
  DragAndDrop
} from 'ol/interaction';
import {
  VectorImage as VectorImageLayer,
  Tile as TileLayer
} from 'ol/layer';
import {
  OSM,
  Vector as VectorSource
} from 'ol/source';

var dragAndDropInteraction = new DragAndDrop({
  formatConstructors: [
    GPX,
    GeoJSON,
    IGC,
    KML,
    TopoJSON
  ]
});

var map = new Map({
  interactions: defaultInteractions().extend([dragAndDropInteraction]),
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

dragAndDropInteraction.on('addfeatures', function (event) {
  var vectorSource = new VectorSource({
    features: event.features
  });
  map.addLayer(new VectorImageLayer({
    source: vectorSource
  }));
  map.getView().fit(vectorSource.getExtent());
});

var displayFeatureInfo = function (pixel) {
  var features = [];
  map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      info.push(features[i].get('name'));
    }
    document.getElementById('info').innerHTML = info.join(', ') || '&nbsp';
  } else {
    document.getElementById('info').innerHTML = '&nbsp;';
  }
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});