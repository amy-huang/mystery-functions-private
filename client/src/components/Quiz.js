import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { TextField } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import withStyles from '@material-ui/styles/withStyles'
import { withRouter } from 'react-router-dom'

const styles = theme => ({
  text: {
    fontSize: 14,
  },
});

class Quiz extends Component {
  constructor(props) {
    super(props)
    this.state = { question: 0 }
  }

  inputGens = this.props.funcObj.inputGenerators()
  currInput = ""
  answerText = ""

  questionInput() {
    var newInput = this.inputGens[this.state.question]()
    this.currInput = newInput
    return newInput
  }

  nextQuestion() {
    // setting state for whichQuestion so that curr input gets re generated
  }

  submitAnswer() {
    // show answer onscreen
    // construct action object
    // send to server
  }

  render() {
    var classes = this.props;

    return (
      < Grid container item spacing={4} justify="center" direction="column">
        <Typography className={classes.text}>What would this function output for {this.questionInput()}? </Typography>
        <TextField label="Expected Output" onChange={this.submitAnswer} onKeyUp={(e) => { if (e.keyCode === 13) { this.submitAnswer() } }} helperText="ENTER to submit">
        </TextField>
      </Grid>
    )
  }
}

export default withRouter(withStyles(styles)(Quiz));