import React, {useRef} from 'react';
import 'ol/ol.css';
import Feature from 'ol/Feature'
import {fromLonLat} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style';

const styles = {
  'geoMarker': new Style({
        stroke: new Stroke({
          width: 2, color: [0, 0, 0, 0.5]
        })
      }),
  'route':new Style({
        image: new CircleStyle({
          radius: 4,
          fill: new Fill({color: 'black'}),
          stroke: new Stroke({
            color: 'white', width: 2
          })
        })
      })
};
const usePlayerLayer = () => {
  const layer = useRef();
  const rangeMarker = useRef(new Feature({
    type: 'route',
    geometry: new Circle(fromLonLat([1,1]), 200, 'XY'),
  }));
  const locationMarker = useRef(new Feature({
    type: 'geoMarker',
    geometry: new Point(fromLonLat([1,1])),
  }));
  
  if(!layer.current) {
    locationMarker.current.setStyle(styles.route);
    rangeMarker.current.setStyle(styles.geoMarker);
    layer.current = new VectorLayer({
      source: new VectorSource({
        features:[rangeMarker.current, locationMarker.current]
      }),
      // style: (feature) => {
      //   return styles[feature.get('type')];
      // }
    })
  }
  const updateLocation = pos => {
    locationMarker.current.getGeometry().setCoordinates(fromLonLat([pos.coords.longitude,pos.coords.latitude]));
    rangeMarker.current.getGeometry().setCenter(fromLonLat([pos.coords.longitude,pos.coords.latitude]));
  };
  return [layer.current, updateLocation]
}
export default usePlayerLayer;