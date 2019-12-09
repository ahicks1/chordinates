import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { getChordsForUser, deleteChord, updateChord } from '../DataUtils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { host } from '../App';
import {views, times} from '../ViewsAndTimes';

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
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}))

const DisplayData = (props) => {
  console.log(props);
  const [ open, setOpen ] = React.useState(false);
  const [view, setView] = React.useState('PRI');
  const [time, setTime] = React.useState(0);
  const [pinID, setpinID] = React.useState(-1);
  const { endpoint = "", authData, authState } = props;
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const handleClick = url => {
    window.open(url, "_blank");
  };
  const handleViewChange = event => {
    setView(event.target.value);
  };
  const handleTimeChange = event => {
    setTime(event.target.value);
  };

  const handleDeleteClick = (pid) => {
    if (authState === 'signedIn') {
      deleteChord(host, authData.getSignInUserSession().accessToken.jwtToken, pid).then(() => {
        getChordsForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
          .then(json => {
            setData(json.chords);
          });
      });
    }
  };

  const handleEditClick = (pid) => {
    if (authState === 'signedIn') {
      setOpen(true);
      setpinID(pid);
    }
  };

  const postFunc = () => {
    updateChord(host, authData.getSignInUserSession().accessToken.jwtToken, pinID, view, time).then(() => {
      getChordsForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
        .then(json => {
          setData(json.chords);
        });
    });
    setOpen(false); 
  }

  useEffect(() => {
    if (authState === 'signedIn') {
      getChordsForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
        .then(json => {
          setData(json.chords);
        });
    }
  }, [endpoint, authData, authState, open]);

  return (
    <section className={classes.container}>
      <div><br /><br /></div>
      <List component='nav'>
        {data.map(chord => {
          return <ListItem
            key={chord.pinID}
          >
            <Button onClick={() => handleClick(chord.url)}>
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
            </Button>
            <ListItemText primary={chord.songname + " during " + chord.timename + " at location (" + chord.longitude + ", " + chord.latitude + ")"} />
            <Button onClick={() => handleEditClick(chord.pinID)}>
              <ListItemIcon>
                <EditIcon />
              </ListItemIcon>
            </Button>
            <Button onClick={() => handleDeleteClick(chord.pinID)}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
            </Button>
          </ListItem>;
        })}
      </List>
      <Dialog
        open={open}
        onClose={() => { setOpen(false) }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Edit Chord Info
        </DialogTitle>
        <DialogContent className={classes.root}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="view"
              select
              label="Select Viewers"
              value={view}
              onChange={handleViewChange}
              helperText="Please select who can view this chord"
              variant="outlined"
            >
              {views.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="time"
              select
              label="Select Time Viewable"
              value={time}
              onChange={handleTimeChange}
              helperText="Please select which times this chord is viewable"
              variant="outlined"
            >
              {times.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>

        <DialogActions>
          <Button id="submit" onClick={postFunc} 
            color="secondary">
            Submit
          </Button>
          <Button id="close" onClick={() => { setOpen(false) }} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default DisplayData;