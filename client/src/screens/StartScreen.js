import React, { Component } from 'react'
import withStyles from '@material-ui/styles/withStyles'
import { withRouter, Link } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TextField, Typography } from '@material-ui/core'
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

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      retrievedID: new URLSearchParams(window.location.search).get('id'),
      enteredID: new URLSearchParams(window.location.search).get('id')
    }
  }

  updateUserID = (text) => {
    this.setState({ enteredID: text })
    if (localStorage.getItem('started') === null) {
      localStorage.setItem('userID', text.trim())
    }
    console.log("userID is now '" + localStorage.getItem('userID') + "'")
    console.log("retrieved '" + this.state.retrievedID + "'")
    console.log("entered '" + this.state.enteredID + "'")
  }

  // Make sure ID isn't changed after study started
  started = () => {
    // TODO: make sure userID is not null
    if (localStorage.getItem('started') === null) {
      // Nothing entered, which means id taken from URL
      if (localStorage.getItem('userID') === null) {
        localStorage.setItem('userID', this.state.enteredID)
      }

      localStorage.setItem('started', true)
    }
  }

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
                      <p>Welcome to mystery functions! Your task is to figure out what a function does. We'll tell you the input and output types. You can tell us any valid input to the function, and we'll tell you what the function outputs.</p>

                      <p>When you're ready to commit to a guess about the function, you'll describe the function your own words with a text submission, and then take a "quiz": we generate inputs to the function, and you tell us what the outputs should be. </p>

                      <p>This is to let you know if your guess is right, so that you can decide when to move on to the next function. </p>

                      <p>If you get a question wrong, you can either go back to evaluating inputs and come up with a different written guess, or give up and skip to seeing the answer, and then go to the next mystery function.</p>

                      <p>There are 2 mystery functions. Good luck!</p>
                    </Grid>

                    {this.state.retrievedID !== null ?
                      <Grid item>
                        <Typography variant="h6" >We retrieved the ID <b>'{this.state.retrievedID}'</b> from your URL. Correct this in the text box below if it is incorrect. Otherwise, you can click BEGIN to move on.</Typography>
                      </Grid>
                      :
                      null
                    }

                    <Grid item>
                      <TextField defaultValue={this.state.enteredID} label="Enter your ID here" onKeyUp={(e) => { this.updateUserID(e.target.value) }} >
                      </TextField>
                    </Grid>


                    {this.state.enteredID === '' || this.state.enteredID === null ?
                      <Grid item>
                        <Typography><i>Warning! Entered ID is empty; please fill in before moving on.</i></Typography>
                      </Grid>
                      :
                      null
                    }

                    <Grid item>
                      <Button type="submit">
                        <Link onFocus={this.started} to={this.props.nextPage}>Begin!</Link>
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