import React, {useRef, useEffect, useState} from 'react';
import Map from './Map'
import '../App.css';
import AddButton from './AddButton';
import PlayChordDialog from './PlayChordDialog';
import { getChordsNearLocation } from '../DataUtils';

import {host} from '../App';


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
    setCurrentChord(chord);
  }

  return <div>
    <Map 
    {...props} 
      locationChanged={setLoc}
      chordClicked={chordClicked}
      chordData={chordData}/>
    <AddButton  {...props} lat={lat} long={lon}/>
    <PlayChordDialog 
      open={currentChord != undefined}
      onClose={()=>setCurrentChord(undefined)}
      chord={currentChord}
    />
  </div>
}
export default MapContainer;