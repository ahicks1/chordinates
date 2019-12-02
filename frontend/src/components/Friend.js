import React, {useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { getFriends } from '../DataUtils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import {host} from '../App'

const rp = require('request-promise-native');
const randStr = () => { return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15); }
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

  const Friend = (props) => {
    console.log(props);
    const {authData} = props;
    const classes = useStyles();
    const [data, setData] = React.useState([]);
    const handleClick = () => {
        window.open("https://open.spotify.com/album/5jZNxb2TgaXKXtTK2dPEqT", "_blank"); 
    };

    useEffect(() => {
        if(authData) {
            getFriends(host, authData.getSignInUserSession().accessToken.jwtToken)
            .then(json => {
              setData(json.friends);
            });
        }
      }, [authData]);
    
      return (
        <section>
            <div><br/><br/></div>
          <List component='nav' className={classes.container}>
            {data.map(friend => {
              return <ListItem
                button key={Boolean(friend.email) ? friend.email : randStr()}
                onClick={ handleClick}
              >
                <ListItemIcon>
                  <FaceIcon />
                </ListItemIcon>
                <ListItemText primary={Boolean(friend.email) ? friend.email : "FRIEND WITHOUT EMAIL"} />
              </ListItem>;
            })}
          </List>
        </section>
      );
  }
  
  export default Friend;