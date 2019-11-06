import React, { Component } from 'react'
import withStyles from '@material-ui/styles/withStyles'
import { withRouter, Link } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TextField } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'

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
    width: 1000,
    marginTop: 40,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100% - 20px)'
    },
    fontSize: 16,
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
  gridListWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
})

// Update userID with each keystroke unless already submitted
// If only submitted when button is clicked, the ID doesn't show
// up for the first few evaluate inputs so this is needed
function updateUserID(text) {
  // console.log("entered: ", text)
  if (localStorage.getItem('started') === null) {
    localStorage.setItem('userID', text)
  }
  console.log("userID is now ", localStorage.getItem('userID'))
}

// Make sure ID isn't changed after study started
function started() {
  if (localStorage.getItem('started') === null) {
    localStorage.setItem('started', true)
  }
}

class StartScreen extends Component {
  render() {
    const { classes } = this.props
    return (
      <React.Fragment>
        <CssBaseline />
        < div className={classes.root} >
          {/* Center all Grids */}
          < Grid container justify="center" spacing={4}>

            <Grid container item spacing={4} className={classes.panel}>
              <Paper className={classes.paper}>
                <div className={classes.gridListWrapper}>
                  <Grid container spacing={4} direction="column">

                    <Grid item className={classes.panel}>
                      <p>Welcome to mystery functions! Your task is to figure out what a function does, based on only the following information: given any input of valid type, we will tell you what the function outputs.</p>

                      <p>On the next screen, you'll see a description of the input and output types on the upper left. There will be an area for submitting inputs to evaluate on the lower left, and a console on the right where output will be displayed. </p>

                      <p>Once you would like to end the session, go to the second tab on the lower left to submit in your own words what you think the function does. You'll be shown the answer (a text description). Then, you can click the link to the next function.</p>

                      <p>There are 2 mystery functions. Good luck!</p>
                    </Grid>

                    <Grid item>
                      <TextField label="Enter your ID here" onKeyUp={(e) => { updateUserID(e.target.value) }} >
                      </TextField>
                    </Grid>

                    <Grid item>
                      <Button type="submit">
                        <Link onClick={started} to={this.props.nextPage}>Begin!</Link>
                      </Button>
                    </Grid>

                  </Grid>
                </div>
              </Paper>
            </Grid>

          </Grid>
        </div>
      </React.Fragment >
    )
  }
}

export default withRouter(withStyles(styles)(StartScreen))