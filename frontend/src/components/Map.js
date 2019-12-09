import React, {useRef, useEffect, useState} from 'react';
import 'ol/ol.css';
import Feature from 'ol/Feature'
import {fromLonLat} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style';

import { getChordsNearLocation } from '../DataUtils';
import useOpenLayersMap from './useOpenLayersMap';
import {host} from '../App';

const useChordLayer = () => {

}

const styles = {
  'geoMarker': new Style({
        stroke: new Stroke({
          width: 2, color: [0, 0, 0, 0.5]
        })
      }),
  'icon': new Style({
    image: new Icon({
      anchor: [0.5, 1],
      src: 'data/icon.png'
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
      }),
  'chordMarker': new Style({
    image: new Icon({
      color: '#00e000',
      crossOrigin: 'anonymous',
      src: 'slice2.png',
      scale: 0.125
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
const GoogleMap = ({locationChanged = () => {}, authData, authState}) => {

  const [chordData, setChordData] = useState([]);
  const [latLon, setLatLon] = useState([1,1]);
  const [loadChords, setLoadChords] = useState(false);
  const chordLayer = useRef( new VectorLayer({
      source: new VectorSource({
        features:[]
      }),
      style: (feature) => {
        return styles[feature.get('type')];
      }
    })
  )
  const [playerLayer, updatePlayerLayerLocation] = usePlayerLayer();
  const map = useOpenLayersMap([playerLayer, chordLayer.current], (pos) => {
    updatePlayerLayerLocation(pos);
    setLatLon([pos.coords.latitude,pos.coords.longitude]);
    locationChanged(pos.coords.latitude,pos.coords.longitude);
  });
  useEffect(() => {
    if(authState === 'signedIn' && !loadChords) {
      const [lat, lon] = latLon;
      getChordsNearLocation(
          host,  
          authData.getSignInUserSession().accessToken.jwtToken, 
          lat, 
          lon
      ).then((data) => {
        console.log(data);
        setChordData(data.chords);
      })
      setLoadChords(true);
    }
  }, [authData, authState])

  useEffect(() => {
    if(!map || !chordLayer.current) return;
    map.on('click', (event) => {
      console.log(chordLayer.current);
      console.log(chordLayer.getFeature);
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        console.log(feature);
        console.log(layer);
      })
      // const lst = chordLayer.current.getFeatures(event.pixel);
      // if(lst.length != 0) {
      //   console.log(lst[0].get('pinID'));
      // }
    })
  }, [map, chordLayer.current])

  useEffect(() => {
    if(!map) return;
    const features = chordData.map((chord) => {
      const {longitude, latitude} = chord;
      return new Feature({
        type:'chordMarker',
        geometry: new Point(fromLonLat([longitude,latitude])),
        params:{...chord}
      })
    })
    console.log(features);
    //chordLayer.current.getSource().clear();
    chordLayer.current.getSource().addFeatures(features);
    
    map.render();
  }, [chordData, map])

  //if(!apiHandle) return <div>Loading...</div>;
  return <div style={{height:'100vh'}} id='googleMapElement'></div>

  
}

export default GoogleMap;
