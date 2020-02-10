import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import Weather from '../Features/Weather/Weather';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1,
    textAlign: 'center',
    padding: 20,
    [theme.breakpoints.up('md')]: {
      textAlign: 'left'
    }
  },
  toolBar: {
    color: theme.palette.primary.main
  },
  weather: {
    display: 'inline',
    margin: 'auto',
    paddingBottom: 20,
    [theme.breakpoints.up('md')]: {
      paddingTop: 20
    }
  }
})); 

export default () => {
  const classes = useStyles();

  const name = "Cole's";
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Typography variant="h6" color="inherit" className={classes.title}>
            {name} EOG React Visualization Assessment
          </Typography>
          <Grid item className={classes.weather}>
            <Weather />
          </Grid> 
        </Grid>
      </Toolbar>
    </AppBar>
  );
};
