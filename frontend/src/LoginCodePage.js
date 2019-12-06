import React, {useRef, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}))
const LoginCodePage = ({history}) => {
  const classes = useStyles();
  

  return <Typography variant="h6">
    Logging in
  </Typography>
}

export default AddButton;