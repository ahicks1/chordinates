import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { getChordsForUser } from '../DataUtils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
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
      width: '100%',
    },
  }))

  const DisplayData = (props) => {
    console.log(props);
    const {endpoint = "", authData, authState} = props;
    const classes = useStyles();
    const [data, setData] = React.useState(['Loading...']);
    const handleClick = url => {
        window.open(url, "_blank"); 
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
        <section>
            <div><br/><br/></div>
          <List component='nav' className={classes.container}>
            {data.map(chord => {
              return <ListItem
                button key={chord.pinID}
                onClick={() => handleClick(chord.url)}
              >
                <ListItemIcon>
                  <MusicNoteIcon />
                </ListItemIcon>
                <ListItemText primary={chord.songname + " during " + chord.timename + " at location (" + chord.longitude + ", " + chord.latitude + ")"} />
              </ListItem>;
            })}
          </List>
        </section>
      );
  }
  
  export default DisplayData;