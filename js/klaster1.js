import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {
  Tile as TileLayer,
  Vector as VectorLayer
} from 'ol/layer';
import {
  Cluster,
  OSM,
  Vector as VectorSource
} from 'ol/source';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Text
} from 'ol/style';


var distance = 30;

var count = 20000;
var features = new Array(count);
var e = 4500000;
for (var i = 0; i < count; ++i) {
  var coordinates = [2 * e * Math.random() - e, 2 * e * Math.random() - e];
  features[i] = new Feature(new Point(coordinates));
}

var source = new VectorSource({
  features: features
});

var clusterSource = new Cluster({
  distance: distance,
  source: source
});

var styleCache = {};
var clusters = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
    var size = feature.get('features').length;
    var style = styleCache[size];
    if (!style) {
      style = new Style({
        image: new CircleStyle({
          radius: size,
          stroke: new Stroke({
            color: '#fff'
          }),
          fill: new Fill({
            color: '#3399CC'
          })
        }),
        text: new Text({
          text: size.toString(),
          fill: new Fill({
            color: '#fff'
          })
        })
      });
      styleCache[size] = style;
    }
    return style;
  }
});

var raster = new TileLayer({
  source: new OSM()
});

var map = new Map({
  layers: [raster, clusters],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});