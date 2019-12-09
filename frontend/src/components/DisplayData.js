import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { getChordsForUser, deleteChord } from '../DataUtils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import {host} from '../App'

const rp = require('request-promise-native');
const useStyles = makeStyles(theme => ({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    container: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'left',
      backgroundColor: 'white',
      color: 'black',
      outline: 'none',
      width: '90%',
      marginLeft: '3%',
      marginRight: '35%',
    },
  }))

  const DisplayData = (props) => {
    console.log(props);
    const {endpoint = "", authData, authState} = props;
    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const handleClick = url => {
        window.open(url, "_blank"); 
    };

    const handleDeleteClick = (pid) => {
      if (authState === 'signedIn') {
        deleteChord(host, authData.getSignInUserSession().accessToken.jwtToken, pid).then( () => {
          getChordsForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
          .then(json => {
            setData(json.chords);
          });
        });
      }
    };

    useEffect(() => {
        if(authState === 'signedIn') {
            getChordsForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
            .then(json => {
              setData(json.chords);
            });
        }
      }, [endpoint, authData, authState]);
    
      return (
        <section className={classes.container}> 
            <div><br/><br/></div>
          <List component='nav'>
            {data.map(chord => {
              return <ListItem
                key={chord.pinID}
              >
                <Button onClick={() => handleClick(chord.pinID)}>
                  <ListItemIcon>
                    <MusicNoteIcon />
                  </ListItemIcon>
                </Button>
                <ListItemText primary={chord.songname + " during " + chord.timename + " at location (" + chord.longitude + ", " + chord.latitude + ")"} />
                <Button onClick={() => handleDeleteClick(chord.pinID)}>
                  <ListItemIcon>
                    <DeleteIcon />
                  </ListItemIcon>
                </Button>
              </ListItem>;
            })}
          </List>
        </section>
      );
  }
  
  export default DisplayData;