import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/styles/withStyles'
import { withRouter } from 'react-router-dom'
import Util from '../Util'
import Link from 'react-router-dom/Link'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey['100'],
    overflow: 'hidden',
    backgroundSize: 'cover',
    backgroundPosition: '0 400px',
    paddingBottom: 200,
    alignContent: 'center',
    alignItems: 'center',
    width: 1000
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

class Quiz extends Component {
  constructor(props) {
    super(props)
    this.state = {
      question: 0,
      answered: false,
      text: "",
      done: false,
      showAnswer: false
    }
  }

  funcObj = this.props.funcObj
  inputGens = this.props.funcObj.inputGenerators()
  currInput = ""
  answerText = ""

  questionInput = () => {
    var newInput = this.inputGens[this.state.question]()
    this.currInput = newInput
    return newInput
  }

  submitAnswer = (submitted) => {
    if (submitted === "") {
      alert("Please submit an answer!")
      return
    }

    const actual = this.funcObj.function(this.currInput)
    const gotCorrect = this.funcObj.equivalentOutputs(submitted, actual)

    //Construct action object and send to server 
    if (localStorage.getItem(this.funcObj.description()) === null) {
      var action = {}
      action.id = localStorage.getItem('userID')
      action.fcn = this.funcObj.description()
      action.key = Util.newKey()
      action.type = "quiz_answer"
      action.in = this.currInput
      action.out = this.funcObj.parseOutput(submitted)
      action.q = this.state.question
      action.actual = actual
      action.result = gotCorrect
      action.time = Util.getCurrentTime()
      console.log(action)
      Util.sendToServer(action)
    }

    // Show answer onscreen
    var answerText = ""
    if (gotCorrect) {
      answerText = "Nice, that's correct!"
    } else {
      answerText = "Incorrect"
    }
    this.setState({ 'answerText': answerText })

    if (this.state.question + 1 < this.inputGens.length) {
      this.setState({ 'answered': true })
    } else {
      this.setState({ done: true })
    }
  }

  nextQuestion = () => {
    if (this.state.question + 1 < this.inputGens.length) {
      this.setState({
        question: this.state.question + 1,
        answered: false,
        text: "",
        answerText: ""
      })
    }
  }

  submitFinalGuess = () => {
    // Construct and submit final answer to server
    var guess = Object()
    guess.id = localStorage.getItem('userID')
    guess.fcn = this.funcObj.description()
    guess.key = Util.newKey()
    guess.type = "final_answer"
    guess.finalGuess = this.props.guessText
    guess.time = Util.getCurrentTime()

    if (localStorage.getItem(this.funcObj.description()) === null) {
      localStorage.setItem(this.funcObj.description(), 'Done')
      Util.sendToServer(guess)
    }
    this.setState({ showAnswer: true })
  }

  toNextPageButton = (nextPage) => {
    if (nextPage === undefined) {
      return (<div>You're done!</div>)
    }
    return (
      <div>
        <Button variant="contained" className={this.props.actionButton} onClick={() => { window.location.reload() }}>
          <Link style={{ color: '#FFF' }} to={nextPage}> go to next mystery function</Link>
        </Button>
      </div>
    )
  }

  render() {
    var classes = this.props;

    return (
      <div className={classes.root}>
        {
          this.state.showAnswer ?
            < Grid container item spacing={4} alignContent="center" justify="center" direction="row" className={classes.panel}>
              <Grid item>
                <Typography variant="h5">Your answer</Typography>
                <Typography variant="h6">{this.props.guessText}</Typography>
                <Typography variant="h1">

                  - - - - - - - -

                </Typography>
                <Typography variant="h5">Our answer</Typography>
                <Typography variant="h6">{this.props.funcObj.answerText()}</Typography>
              </Grid>
              <Grid item>
                {this.toNextPageButton(this.props.nextPage)}
              </Grid>
            </ Grid>
            :
            < Grid container item spacing={4} justify="center" direction="column" className={classes.panel}>
              <Grid item>
                <Button variant="contained" type="submit" onClick={this.props.cancelFcn}>
                  Go back to evaluator
                    </Button>
              </Grid>
              <Grid item>
                <Typography variant="h4">Question {this.state.question + 1} out of {this.inputGens.length}:  </Typography>
                <Typography variant="h3">What would this function output for {this.questionInput()}? </Typography>

                <TextField onChange={(e) => { this.setState({ text: e.target.value }) }} value={this.state.text} onKeyUp={(e) => { if (e.keyCode === 13) { this.submitAnswer(e.target.value) } }} helperText="ENTER to submit">
                </TextField>
              </Grid>
              <Grid item>
                <Typography variant="h5">{this.state.answerText}</Typography>
              </Grid>
              {
                this.state.answered ?
                  <Grid item>
                    <Button variant="contained" type="submit" onClick={this.nextQuestion}>
                      Next Question
                    </Button>
                  </Grid>
                  : null
              }
              {
                this.state.done ?
                  <Grid item>
                    <Button color='primary' variant="contained" type="submit" onClick={this.submitFinalGuess}>
                      <Typography variant="h4">Submit guess</Typography>
                    </Button>
                  </Grid>

                  : null
              }
            </Grid >
        }
      </div>
    )
  }
}

export default withRouter(withStyles(styles)(Quiz));