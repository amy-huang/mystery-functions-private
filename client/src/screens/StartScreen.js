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
    if (localStorage.getItem('started') === null) {
      localStorage.setItem('userID', text.trim())
    }
    this.setState({ enteredID: text.trim() })
    console.log("userID is '" + localStorage.getItem('userID') + "'")
    // console.log("retrieved '" + this.state.retrievedID + "'")
    // console.log("entered '" + this.state.enteredID + "'")
  }

  begin = () => {
    if (localStorage.getItem('started') === null) {
      // Nothing entered, which means id taken from URL
      if (localStorage.getItem('userID') === null) {
        localStorage.setItem('userID', this.state.enteredID)
      }

      // Check for empty or null IDs
      if (localStorage.getItem('userID') === null || localStorage.getItem('userID') === 'null' || localStorage.getItem('userID') === '') {
        alert("Invalid user ID of '" + localStorage.getItem('userID') + "'. Please re-enter your ID.")
        return
      }

      // Record start, and go to next page
      localStorage.setItem('started', true)
      this.props.history.push(this.props.nextPage)
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
                      <p>Welcome to mystery functions!</p>

                      <p>Your task in this experiment is to guess what function the computer has in mind.</p>

                      <p>A function takes an input and produces an output. For example, the function “double” takes any number as input and outputs twice that number.  If you gave it 5 as an input, “double” would produce 10 as output.  Functions can also take lists of numbers.  For example, the function “find largest” takes a list like [5,8,2,3] and outputs the largest number in the list - in this case, the number 8.</p>

                      <p>When you're ready to take a guess as to what the function is, you can submit some text, and then take a "quiz": we generate inputs to the function, and you tell us what the outputs should be. </p>

                      <p>If you get a question wrong, you can either go back to evaluating inputs and come up with a different guess, or give up and skip to seeing the answer. If you get all the questions right, your guess is most likely correct; you will also then go to seeing the answer.</p>
                    </Grid>

                    {this.state.retrievedID !== null ?
                      <Grid item>
                        <Typography variant="h6" >We retrieved the ID <b>'{this.state.retrievedID}'</b> from your URL. Correct this in the text box below if needed.</Typography>
                      </Grid>
                      :
                      null
                    }

                    <Grid item>
                      <TextField defaultValue={this.state.enteredID} label="Enter your Turker ID here" onKeyUp={(e) => { this.updateUserID(e.target.value) }} >
                      </TextField>
                    </Grid>

                    <Grid item>
                      <Button type="submit" onClick={this.begin}>
                        Begin!
                        {/* <Link onFocus={this.started} to={this.props.nextPage}>Begin!</Link> */}
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