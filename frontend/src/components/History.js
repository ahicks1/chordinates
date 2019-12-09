import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { getHistoryForUser } from '../DataUtils';
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

  const History = (props) => {
    console.log(props);
    const {endpoint = "", authData, authState} = props;
    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const handleClick = url => {
        window.open(url, "_blank"); 
    };

    const handleDeleteClick = (pid) => {
      if (authState === 'signedIn') {
        // deleteChord(host, authData.getSignInUserSession().accessToken.jwtToken, pid).then( () => {
        //   getChordsForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
        //   .then(json => {
        //     setData(json.chords);
        //   });
        // });
      }
    };

    useEffect(() => {
        if(authState === 'signedIn') {
            getHistoryForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
            .then(json => {
              setData(json.history);
            });
        }
      }, [endpoint, authData, authState]);
    
      return (
        <section className={classes.container}> 
            <div><br/><br/></div>
          <List component='nav'>
            {data.map(play => {
              return <ListItem
                key={play.pinID}
              >
                <Button onClick={() => handleClick(play.url)}>
                  <ListItemIcon>
                    <MusicNoteIcon />
                  </ListItemIcon>
                </Button>
                <ListItemText primary={play.songname + " at " + play.timestamp} />
                <Button onClick={() => handleDeleteClick(play.pinID)}>
                </Button>
              </ListItem>;
            })}
          </List>
        </section>
      );
  }
  
  export default History;