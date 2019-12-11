import React, {useRef, useEffect, useState} from 'react';
import Map from './Map'
import '../App.css';
import AddButton from './AddButton';
import PlayChordDialog from './PlayChordDialog';
import { getChordsNearLocation, playSong } from '../DataUtils';

import {host} from '../App';

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

const defaultChord = {};

const MapContainer = (props) => {
  const {authData, authState} = props;
  const [chordData, setChordData] = useState([]);
  const [latLon, setLatLon] = useState([0,0]);
  const [loadChords, setLoadChords] = useState(false);
  const [lat, lon] = latLon;
  const [currentChord, setCurrentChord] = React.useState(undefined);
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
  }, [authData, authState]);
  const setLoc = (latitude, longitude) => {
    console.log("location updated", latitude, longitude);
    setLatLon([latitude,longitude]); 
  }
  const chordClicked = (chord) => {
    console.log(chord);
    console.log(distanceInMBetweenEarthCoordinates(lat,lon,chord.latitude, chord.longitude))
    setCurrentChord(chord);
  }

  let token;

  if(authState === 'signedIn') token = authData.getSignInUserSession().accessToken.jwtToken;

  return <div>
    <Map 
    {...props} 
      locationChanged={setLoc}
      chordClicked={chordClicked}
      chordData={chordData}/>
    <AddButton  {...props} lat={lat} long={lon}/>
    <PlayChordDialog 
      onPlay={()=>{console.log('Playing');
        playSong(host, authData.getSignInUserSession().accessToken.jwtToken, currentChord.pinID);
        setCurrentChord(undefined)
      }}
      token={token}
      open={currentChord != undefined}
      onClose={()=>setCurrentChord(undefined)}
      chord={currentChord?currentChord:defaultChord}
    />
  </div>
}
export default MapContainer;