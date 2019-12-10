import React from 'react';
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

const PlayChordDialog = ({open, onClose, chord={}}) => {
  const classes = useStyles();
  const playSong = () => {};
  const {songname='Closing', url=''} = chord;
  return <Dialog
  open={open}
  onClose={onClose}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">
    {songname}
  </DialogTitle>
  <DialogContent className={classes.root}>
    Hello world
  </DialogContent>

  <DialogActions>
    <Button id="submit" onClick={onClose} 
      href={url}
      rel="noopener"
      target="_blank"
      color="secondary">
      Play
    </Button>
    <Button id="close" onClick={onClose} color="secondary">
      Cancel
    </Button>
  </DialogActions>
</Dialog>
}

export default PlayChordDialog;