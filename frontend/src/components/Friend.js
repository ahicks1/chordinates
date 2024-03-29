import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { getFriends, postFriend, deleteFriend } from '../DataUtils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import FaceIcon from '@material-ui/icons/Face';
import DeleteIcon from '@material-ui/icons/Delete';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import { host } from '../App';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
  toTheLeft: {
    marginLeft: '3%',
    marginRight: '35%',
  }
}))

const Friend = (props) => {
  const { authData, authState } = props;
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [add, setAdd] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const handleClick = (uid) => {
    if (authState === 'signedIn') {
      deleteFriend(host, authData.getSignInUserSession().accessToken.jwtToken, uid).then( () => {
        getFriends(host, authData.getSignInUserSession().accessToken.jwtToken)
        .then(json => {
          setData(json.friends);
        });
      });
    }
  };
  const handleEmailChange = event => {
    setEmail(event.target.value);
  };
  const postFunc = () => {
    if (authState === 'signedIn') {
      postFriend(host, authData.getSignInUserSession().accessToken.jwtToken, email);
    }
  }

  useEffect(() => {
    if (authState === 'signedIn') {
      getFriends(host, authData.getSignInUserSession().accessToken.jwtToken)
        .then(json => {
          setData(json.friends);
        });
    }
  }, [authData, add, authState]);

  return (
    <section className={classes.toTheLeft}>
      <div><br /><br /></div>
      <List component='nav' className={classes.container}>
        {data.map(friend => {
          return <ListItem
            key={Boolean(friend.email) ? friend.email : randStr()}
          >
            <ListItemIcon>
              <FaceIcon />
            </ListItemIcon>
            <ListItemText primary={Boolean(friend.email) ? friend.email : "FRIEND WITHOUT EMAIL"} />
            <Button onClick={() => handleClick(friend.uid)}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
            </Button>
          </ListItem>;
        })}
        <ListItem
          button key={'Add Friend'}
          onClick={() => { setAdd(true); }}
        >
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary={'Add a New Friend!'} />
        </ListItem>
          </List>

      <Dialog
        open={add}
        onClose={() => { setAdd(false) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Input New Friend Info
        </DialogTitle>
        <DialogContent className={classes.root}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="email" label="Friend Email" variant="outlined" onChange={handleEmailChange} />
          </form>
        </DialogContent>

        <DialogActions>
          <Button id="submit" onClick={() => { setAdd(false); postFunc(); }} color="secondary">
            Add Friend
          </Button>
          <Button id="close" onClick={() => { setAdd(false) }} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default Friend;