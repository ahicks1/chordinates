import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

const rp = require('request-promise-native');
const useStyles = makeStyles(theme => ({
    fab: {
      position: 'absolute',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  }))

  const getData = () => {
    
  }

  const DisplayData = ({open = false, endpoint = "", authData}) => {
    const classes = useStyles();
    console.log(endpoint);
    return <div></div>
  }
  
  export default DisplayData;