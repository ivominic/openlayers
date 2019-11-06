import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';


var wmsSource = new ImageWMS({
  url: 'https://ahocevar.com/geoserver/wms',
  params: {
    'LAYERS': 'ne:ne'
  },
  serverType: 'geoserver',
  crossOrigin: 'anonymous'
});

var wmsLayer = new ImageLayer({
  source: wmsSource
});

var view = new View({
  center: [0, 0],
  zoom: 1
});

var map = new Map({
  layers: [wmsLayer],
  target: 'map',
  view: view
});

map.on('singleclick', function (evt) {
  document.getElementById('info').innerHTML = '';
  var viewResolution = /** @type {number} */ (view.getResolution());
  var url = wmsSource.getFeatureInfoUrl(
    evt.coordinate, viewResolution, 'EPSG:3857', {
      'INFO_FORMAT': 'text/html'
    });
  if (url) {
    fetch(url)
      .then(function (response) {
        return response.text();
      })
      .then(function (html) {
        alert(html);
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