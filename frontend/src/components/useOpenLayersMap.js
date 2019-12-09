import React, {useRef, useEffect} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj';
import Stamen from 'ol/source/Stamen';
import {defaults} from 'ol/interaction';

const useOpenLayersMap = (externalLayers=[], locationCallback = () => {}) => {
  const map = useRef();
  useEffect(() => {
    const view = new View({
      center: fromLonLat([1,1 ]),
      zoom: 16
    });
    const interactions = defaults({
      dragPan:false, 
      altShiftDragRotate:false, 
      pinchRotate: false,

    });
    map.current = new Map({
      target: 'googleMapElement',
      controls:[],
      interactions: interactions,
      layers: [
        
        new TileLayer({
          source: new Stamen({
            layer: 'watercolor'
          })
        }),
        new TileLayer({
          source: new Stamen({
            layer: 'terrain-labels'
          })
        }),
        ...externalLayers,
      ],
      view: view,
    });
    const id = navigator.geolocation.watchPosition( pos => {
      console.log("got position = "+pos.coords.latitude,pos.coords.longitude)
      view.setCenter(fromLonLat([pos.coords.longitude,pos.coords.latitude]))
      locationCallback(pos)
      map.current.render();
    }, () => {}, {enableHighAccuracy: true});
    return () => {
      navigator.geolocation.clearWatch(id);
    };

  }, []);


  return map.current;
}
export default useOpenLayersMap;