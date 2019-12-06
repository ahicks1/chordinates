import React, {useRef, useEffect, useState} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import Feature from 'ol/Feature'
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import {fromLonLat} from 'ol/proj';
import Stamen from 'ol/source/Stamen';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point'

import {Circle as CircleStyle, Fill, Icon, Stroke, Style} from 'ol/style';
import { getChordsNearLocation } from '../DataUtils';

import {host} from '../App';

const GoogleMap = ({locationChanged = () => {}, authData, authState}) => {

  const [chordData, setChordData] = useState([]);
  const [latLon, setLatLon] = useState([1,1]);
  const [loadChords, setLoadChords] = useState(false);
  const map = useRef();
  // if(!loadChords) {
  //   setLoadChords(true);
  //   getChordsNearLocation(host, token, lat, lon)
  // }
  console.log(authData);
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
  const view = new View({
    center: fromLonLat([1,1 ]),
    zoom: 16
  });

  const locationMarker = new Feature({
    type: 'geoMarker',
    geometry: new Point(fromLonLat([1,1])),
  })

  const chordLayer = useRef( new VectorLayer({
      source: new VectorSource({
        features:[]
      }),
      style: (feature) => {
        return styles[feature.get('type')];
      }
    })
  )

  useEffect(() => {
    if(!map.current) return;
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
    map.current.render();
  }, [chordData, map.current])

  
  const playerLayer = new VectorLayer({
    source: new VectorSource({
      features:[locationMarker]
    }),
    style: (feature) => {
      return styles[feature.get('type')];
    }
  })
  
  var styles = {
    'route': new Style({
      stroke: new Stroke({
        width: 6, color: [237, 212, 0, 0.8]
      })
    }),
    'icon': new Style({
      image: new Icon({
        anchor: [0.5, 1],
        src: 'data/icon.png'
      })
    }),
    'geoMarker': new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({color: 'black'}),
        stroke: new Stroke({
          color: 'white', width: 2
        })
      })
    }),
    'chordMarker': new Style({
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({color: 'green'}),
        stroke: new Stroke({
          color: 'white', width: 2
        })
      })
    })
  };

  
  
  useEffect(() => {
    map.current = new Map({
      target: 'googleMapElement',
      controls:[],
      interactions:[],
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
        chordLayer.current,
        playerLayer
      ],
      view: view,
    });
    const id = navigator.geolocation.watchPosition((pos) => {
      console.log("got position = "+pos.coords.latitude,pos.coords.longitude)
      locationChanged(pos.coords.latitude,pos.coords.longitude);
      view.setCenter(fromLonLat([pos.coords.longitude,pos.coords.latitude]))
      map.current.render();
      const pt = new Point(fromLonLat([pos.coords.longitude,pos.coords.latitude]))
      locationMarker.setGeometry(pt);
    }, () => {}, {enableHighAccuracy: true});

    return () => {
      navigator.geolocation.clearWatch(id);
    };

  }, [])
  


  


  //if(!apiHandle) return <div>Loading...</div>;
  return <div style={{height:'100vh'}} id='googleMapElement'></div>

  
}

export default GoogleMap;
