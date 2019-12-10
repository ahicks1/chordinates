import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { getHistoryForUser, postReviews } from '../DataUtils';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import StarRateIcon from '@material-ui/icons/StarRate';
import Button from '@material-ui/core/Button';
import { host } from '../App'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Rating from '@material-ui/lab/Rating';

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
  const { endpoint = "", authData, authState } = props;
  const classes = useStyles();
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [pin, setPin] = React.useState(-1);
  const [stars, setStars] = React.useState(-1);

  const handleClick = url => {
    window.open(url, "_blank");
  };

  const handleStarClick = (pid) => {
    if (authState === 'signedIn') {
      setOpen(true);
      setPin(pid);
    }
  };

  const postFunc = () => {
    if (authState === 'signedIn') {
      postReviews(host, authData.getSignInUserSession().accessToken.jwtToken, pin, stars);
    }
  };

  useEffect(() => {
    if (authState === 'signedIn') {
      getHistoryForUser(host, authData.getSignInUserSession().accessToken.jwtToken)
        .then(json => {
          setData(json.history);
        });
    }
  }, [endpoint, authData, authState]);

  return (
    <section className={classes.container}>
      <div><br /><br /></div>
      <List component='nav'>
        {data.map(play => {
          return <ListItem
            key={play.pinID + play.timestamp}
          >
            <Button onClick={() => handleClick(play.url)}>
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
            </Button>
            <ListItemText primary={play.songname + " at " + play.timestamp} />
            <Button onClick={() => handleStarClick(play.pinID)}>
              <StarRateIcon />
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
          Rate this Chord!
        </DialogTitle>
        <DialogContent className={classes.root}>
          <form className={classes.root} noValidate autoComplete="off">
          <Rating
            name="simple-controlled"
            value={stars}
            onChange={(event, newValue) => {
              console.log(newValue);
              setStars(newValue);
            }}
            name="pristine"
          />
          </form>
        </DialogContent>

        <DialogActions>
          <Button id="submit" onClick={() => { setOpen(false); postFunc(); }} color="secondary">
            Add Review
          </Button>
          <Button id="close" onClick={() => { setOpen(false) }} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}

export default History; 