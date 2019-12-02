import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Map from './components/Map'
import './App.css';
import './components/AddButton'
import AddButton from './components/AddButton';
import Amplify, { Auth } from 'aws-amplify';
import { Authenticator } from 'aws-amplify-react';

import { 
  ConfirmSignIn, 
  ConfirmSignUp, 
  ForgotPassword, 
  RequireNewPassword, 
  SignIn, 
  VerifyContact,
  SignUp } from 'aws-amplify-react';


import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SwitchMUI from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
//import SignUp from './CustomSignup'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const ampTheme = {
  sectionHeader: {},
  button: { 'backgroundColor': '#8e24aa' },
  a: {'color':'#8e24aa'}
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  bar: {
    color: 'black',
    position: 'absolute',
    background: 'transparent',
  },
}));

Amplify.configure({
  Auth: {
      // REQUIRED - Amazon Cognito Region
      region: 'us-east-2', 
      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-east-2_AgsbUqb60',
      // OPTIONAL - Amazon Cognito Web Client ID
      userPoolWebClientId: '1phrfhdqqddk39u257h5mj3csj', 
      // Manually set the authentication flow type. Default is 'USER_SRP_AUTH'
      authenticationFlowType: 'USER_SRP_AUTH'
  }
});

function App() {
  const classes = useStyles();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleChange = event => {
    //setAuth(event.target.checked);
  };

  const handleSignOut = () => {
    Auth.signOut()
    setAnchorEl(null);
    
  }

  const handleMenu = event => {
    const currTarget = event.currentTarget;
    console.log(currTarget);
    setAnchorEl(currTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
      <Router>
        <div className="App">
        <AppBar elevation={0} position="static" className={classes.bar}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Chordinates
          </Typography>
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                anchorEl = {anchorEl}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleSignOut}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Sign out</MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            {/* <Route path="/about">
              <About />
            </Route> */}
            <Route path="/users">
               Put new routes here
            </Route>
            <Route path="/login-code">

            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    )
}

const Home = () => {
    return <Authenticator hideDefault={true} theme={ampTheme}>
      <SignIn/>
    <SignUp/>
    <ConfirmSignIn/>
    <VerifyContact/>
    <ConfirmSignUp/>
    <ForgotPassword/>
    <RequireNewPassword />
    <div >
      <Map/>
      <AddButton/>
    </div></Authenticator>
}

export default App;
