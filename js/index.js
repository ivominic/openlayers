import "ol/ol.css";
import {
  Map,
  View
} from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM()
    })
  ],
  view: new View({
    center: [2213892.18, 5475418.61],
    zoom: 7
  })
});