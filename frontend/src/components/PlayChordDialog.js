import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getReviews } from '../DataUtils';
import Rating from '@material-ui/lab/Rating';
import { host } from '../App';

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

const PlayChordDialog = ({token, open, onClose, onPlay, chord={}}) => {
  const classes = useStyles();
  const {songname='Closing', url='', pinID} = chord;
  const [rating, setRating] = useState(-1);
  useEffect( () => {
    if(chord.pinID) {
      getReviews(host, token, pinID ).then(({ratings=[]}) => {
        console.log('fetched reviews');
        console.log(ratings);
        const obj = ratings[0]?ratings[0]:{};
        const avg = obj.avg!=null? obj.avg:0;
        setRating(avg)
      })
    } else {
      setRating(-1);
    }
  }, [chord]);
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
  {rating >= 0 && <Rating
            name="simple-controlled"
            value={rating}
            readOnly
          />}
  </DialogContent>

  <DialogActions>
    <Button id="submit" onClick={onPlay} 
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