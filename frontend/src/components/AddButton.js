import React, { useRef, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { postChord } from '../DataUtils';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import {host} from '../App';
import {views, times} from '../ViewsAndTimes';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}))

const AddButton = (props) => {
  const { lat, long, authData } = props
  const classes = useStyles();
  const [view, setView] = React.useState('PRI');
  const [time, setTime] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [spotifyurl, setUrl] = React.useState("");
  const handleViewChange = event => {
    setView(event.target.value);
  };
  const handleTimeChange = event => {
    setTime(event.target.value);
  };
  const handleUrlChange = event => {
    setUrl(event.target.value);
  };
  const postFunc = () => {
    if(authData){
      postChord(host, authData.getSignInUserSession().accessToken.jwtToken, lat, long, view, time, spotifyurl);
    }
  }

  return <div>
    <Fab aria-label="AddButton" className={classes.fab} color='primary' onClick={() => {setOpen(true);}}>
      <AddIcon />
    </Fab>
    <Dialog
      open={open}
      onClose={() => {setOpen(false)}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
    <DialogTitle id="alert-dialog-title">
      Input New Chord Info
    </DialogTitle>
    <DialogContent className={classes.root}>
      <form className={classes.root} noValidate autoComplete="off">
        <TextField id="url" label="Spotify URL" variant="outlined" onChange={handleUrlChange}/>
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
      <Button id="submit" onClick={() => {setOpen(false); postFunc();}} color="secondary">
        Submit
      </Button>
      <Button id="close" onClick={() => {setOpen(false)}} color="secondary">
        Close
      </Button>
    </DialogActions>
  </Dialog>;
    
  </div>
}

export default AddButton;