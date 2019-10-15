import React, { Component } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import { withRouter, Link } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    paddingBottom: 200
  },
  grid: {
    width: 1200,
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    },
  },
  panel: {
    width: 600,
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    },
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
  rangeLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2)
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32
  },
  outlinedButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1)
  },
  actionButtom: {
    textTransform: 'uppercase',
    margin: theme.spacing(1),
    width: 152
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: 'center'
  },
  block: {
    padding: theme.spacing(2),
  },
  box: {
    marginBottom: 40,
    height: 120
  },
  tallBox: {
    marginBottom: 40,
    height: 320
  },
  inlining: {
    display: 'inline-block',
    marginRight: 10
  },
  buttonBar: {
    display: 'flex'
  },
  alignRight: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  noBorder: {
    borderBottomStyle: 'hidden'
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: 'absolute',
    top: '40%',
    left: '40%'
  },
  gridList: {
    width: 400,
    height: gridListHeight,
    alignContent: 'flex-start',
  },
  gridListWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
});

class StartScreen extends Component {
  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        < div className={classes.root} >
          {/* Center all Grids */}
          < Grid container alightContent="center" justify="center" direction="column" spacing={4} padding={4}>

              <Grid item className={classes.panel}>
                <Typography>
                  Welcome to mystery functions! Your task is to figure out what a function does, based on only the following information: 1) given any input of valid type, we will tell you what the function outputs; 2) given any input and output pair of valid types, we will tell you if that is a correct pair for the function.
  
                  Feel free to switch between the two modes as you wish in the tabs on the left half of the screen - output will appear in the console on the right half. Once you would like to end the session, go to the third tab to make a final submission as to what the function is, and you'll be shown a description of what the function does. Then, you can click the link to the next function.
  
                  There are 2 mystery functions. Good luck!
              </Typography>
              </Grid>
              <Grid item>
                <Button type="submit">
                  <Link to={this.props.nextPage}>Begin!</Link>
                </Button>
              </Grid>

          </Grid>
        </div>
      </React.Fragment >
    )
  }
}

export default withRouter(withStyles(styles)(StartScreen));