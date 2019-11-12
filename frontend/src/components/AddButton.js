import React, {useRef, useEffect} from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme => ({
  fab: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}))
const AddButton = () => {
  const classes = useStyles();
  return <Fab aria-label="AddButton" className={classes.fab} color='primary'>
    <AddIcon />
  </Fab>
}

export default AddButton;