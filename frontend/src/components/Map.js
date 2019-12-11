import React, {useRef, useEffect, useState} from 'react';
import 'ol/ol.css';
import Feature from 'ol/Feature'
import {fromLonLat} from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import Circle from 'ol/geom/Circle';
import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style';

import useOpenLayersMap from './useOpenLayersMap';
import usePlayerLayer from './usePlayerLayer';

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
  }),
  'chordMarkerInvalid': new Style({
    image: new Icon({
      color: '#fc0303',
      crossOrigin: 'anonymous',
      src: 'slice3.png',
      scale: 0.125
    })
  }),
};

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInMBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusM = 6371000;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusM * c;
}

const GoogleMap = ({chordData, locationChanged = () => {}, chordClicked=()=>{}, authData, authState}) => {

  
  const [latLon, setLatLon] = useState([1,1]);
  const chordLayer = useRef( new VectorLayer({
      source: new VectorSource({
        features:[]
      }),
      style: (feature) => {
        if(feature.get('inrange')) return styles['chordMarker'];
        else return styles['chordMarkerInvalid']
      }
    })
  )
  const [playerLayer, updatePlayerLayerLocation] = usePlayerLayer();
  const map = useOpenLayersMap([playerLayer, chordLayer.current], (pos) => {
    updatePlayerLayerLocation(pos);
    setLatLon([pos.coords.latitude,pos.coords.longitude]);
    locationChanged(pos.coords.latitude,pos.coords.longitude);
  });
  const handler = useRef();
  useEffect(() => {
    if(!map || !chordLayer.current) return;
    const func = (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
        if(layer === chordLayer.current) {
          if(feature.getProperties().inrange)
            chordClicked(feature.getProperties().params);
          console.log("CHORD clicked!", event.pixel)
          return true;
        }
        console.log("Something else clicked")
        return false;
      
      },{hitTolerance: 8})
    };
    map.on('click', func);

    chordLayer.current.getSource().forEachFeature(feature => {
      const {inrange, params} = feature.getProperties();
      const {latitude, longitude} = params;
      const newrange = distanceInMBetweenEarthCoordinates(
        latLon[0], 
        latLon[1], 
        latitude, 
        longitude) < 165;
      feature.setProperties({inrange:newrange})
    })

    return () => {
      map.un('click', func);
    }
  }, [map, chordLayer.current, latLon])

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
    
    // console.log(features);
    //chordLayer.current.getSource().clear();
    chordLayer.current.getSource().addFeatures(features);
    chordLayer.current.getSource().forEachFeature(feature => {
      const {inrange, params} = feature.getProperties();
      const {latitude, longitude} = params;
      const newrange = distanceInMBetweenEarthCoordinates(
        latLon[0], 
        latLon[1], 
        latitude, 
        longitude) < 165;
      feature.setProperties({inrange:newrange})
    })
    
    map.render();
  }, [chordData, map])

  //if(!apiHandle) return <div>Loading...</div>;
  return <div style={{height:'100vh'}} id='googleMapElement'></div>

  
}

export default GoogleMap;
