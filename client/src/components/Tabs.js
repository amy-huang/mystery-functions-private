import React from 'react'
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
import Util from '../Util'

const userID = localStorage.getItem('userID')

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}))

// For storing user input
var evalInputStr = ""
var evalInputReason = ""
var finalGuess = ""

export default function SimpleTabs(props) {
  const classes = useStyles()

  // For switching tabs
  const [value, setValue] = React.useState(0)
  function handleChange(event, newValue) {
    setValue(newValue)
  }

  // Passed down from GuessingScreen for adding to guesses
  // and evaluating expressions with mystery function
  var guesses = props.children.guesses
  var updateFunc = props.children.updateFunc
  var funcObj = props.children.funcObj
  var toQuiz = props.children.toQuiz

  function evalInput() {
    if (!funcObj.validInput(evalInputStr)) {
      alert("'" + evalInputStr + "' is not a valid input to this function")
      return
    }
    var guess = {}
    guess.id = userID
    guess.fcn = funcObj.description()
    guess.key = Util.newKey()
    guess.type = "eval_input"
    guess.in = funcObj.parseInput(evalInputStr)
    guess.out = funcObj.function(funcObj.parseInput(evalInputStr))
    guess.finalGuess = evalInputReason.trim()
    guess.time = Util.getCurrentTime()
    if (localStorage.getItem(funcObj.description()) === null) {
      Util.sendToServer(guess)
    }
    guesses.push(guess)
    updateFunc()
  }

  evalInputStr = funcObj.inputPlaceHolderText()

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Evaluate Input" {...a11yProps(0)} />
          {/* <Tab label="Input/Output pair" {...a11yProps(1)} /> */}
          <Tab label="Final Guess" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container spacing={4}>
          <Grid container item spacing={4} direction="column">
            <Grid item>
              <TextField label="Input" onChange={(e) => { evalInputStr = e.target.value }} onKeyUp={(e) => { if (e.keyCode === 13) { evalInput() } }} helperText="ENTER to submit" defaultValue={funcObj.inputPlaceHolderText()}>
              </TextField>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container spacing={4} direction="column">
          <Grid item>
            <TextField multiline={true} rows={4} fullWidth={true} variant="outlined" placeholder="What do you think this function does?" onChange={(e) => { finalGuess = e.target.value }}>
            </TextField>
          </Grid>
          <Grid item>
            <div>
              <Button color='primary' variant="contained" className={classes.actionButton} onClick={() => { toQuiz(finalGuess) }}>
                To Quiz
                </Button>
            </div>
          </Grid>
        </Grid>
      </TabPanel>
    </div >
  )
}