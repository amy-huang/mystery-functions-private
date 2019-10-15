import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Link from 'react-router-dom/Link';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function newKey() {
  if (typeof newKey.key == 'undefined') {
    newKey.key = 0;
  } else {
    newKey.key += 1;
  }
  return newKey.key;
}

// For storing user input
var evalInputStr = "";
var evalInputReason = "";
var evalPairInput = "";
var evalPairOutput = "";
var evalPairReason = "";
var finalGuess = "";

export default function SimpleTabs(props) {
  const classes = useStyles();

  // For switching tabs
  const [value, setValue] = React.useState(0);
  function handleChange(event, newValue) {
    setValue(newValue);
  }

  function sendToServer(obj) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", '/store', true);
    xhr.send(JSON.stringify(obj));
  }

  // Passed down from GuessingScreen for adding to guesses
  // and evaluating expressions with mystery function
  var guesses = props.children.guesses
  var updateFunc = props.children.updateFunc
  var funcObj = props.children.funcObj

  function evalInput() {
    if (!funcObj.validInput(evalInputStr)) {
      alert("'" + evalInputStr + "' is not a valid input to this function");
      return;
    }
    if (evalInputReason === "") {
      alert("Please submit a reason that you evaluated this input: " + evalInputStr);
      return;
    }

    // Create guess
    var guess = {};
    guess.key = newKey();
    guess.type = "eval_input";
    guess.in = funcObj.parseInput(evalInputStr);
    guess.out = funcObj.function(funcObj.parseInput(evalInputStr));
    guess.reason = evalInputReason.trim();
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;
    guess.time = dateTime

    // Send to server for storing
    sendToServer(guess)

    // Update console
    guesses.push(guess);
    updateFunc();
  }

  function evalInputOutputPair() {
    if (!funcObj.validInput(evalPairInput)) {
      alert("'" + evalPairInput + "' is not a valid input to this function");
      return;
    }
    if (!funcObj.validOutput(evalPairOutput)) {
      alert("'" + evalPairOutput + "' is not a valid output of this function");
      return;
    }
    if (evalPairReason === "") {
      alert("Please submit a reason that you evaluated this input/output pair: " + evalPairInput + " -> " + evalPairOutput);
      return;
    }

    var guess = {};
    guess.key = newKey();
    guess.type = "eval_guess";
    guess.in = funcObj.parseInput(evalPairInput);
    guess.out = funcObj.parseOutput(evalPairOutput);
    if (funcObj.equivalentOutputs(funcObj.function(guess.in), guess.out)) {
      guess.result = "YES";
    } else {
      guess.result = "NO";
    }
    guess.reason = evalPairReason.trim();
    guesses.push(guess);
    updateFunc();
  }

  var guessField;
  function showAnswer() {
    if (finalGuess === "") {
      var text = "Please submit a final guess."
      alert(text);
      return;
    }
    alert(guessField.placeHolder = funcObj.answerText());
    // TODO: RELOAD THE PAGE to reset console, tab textfields, etc
  }

  function toNextPageButton() {
    if (props.children.nextPage === undefined) {
      return (<div></div>)
    }
    return (
      <div>
        <Button color='primary' variant="contained" className={classes.actionButton} onClick={() => { window.location.reload() }}>
          <Link style={{ color: '#FFF' }} to={props.children.nextPage}> go to next mystery function</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Input" {...a11yProps(0)} />
          <Tab label="Input/Output pair" {...a11yProps(1)} />
          <Tab label="Final Guess" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container spacing={4}>
          <Grid container item spacing={4} direction="column">
            <Grid item>
              <TextField label="Input" onChange={(e) => { evalInputStr = e.target.value; }}>
              </TextField>
            </Grid>
            <Grid item >
              <TextField multiline={true} rows={1} fullWidth={true} variant="outlined" placeholder="Why this input?" onChange={(e) => { evalInputReason = e.target.value; }}>
              </TextField>
            </Grid>
          </Grid>

          <Grid item>
            <div>
              <Button type="submit" color='primary' variant="contained" className={classes.actionButton} onClick={evalInput}>
                Submit
              </Button>
            </div>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={value} index={1}>
        <Grid container spacing={4}>
          <Grid container item spacing={4}>
            <Grid item>
              <TextField label="Input" onChange={(e) => { evalPairInput = e.target.value; }}>
              </TextField>
            </Grid>
            <Grid item>
              <TextField label="Output" onChange={(e) => { evalPairOutput = e.target.value; }}>
              </TextField>
            </Grid>
          </Grid>

          <Grid container item spacing={4} direction="column">
            <Grid item>
              <TextField multiline={true} rows={1} fullWidth={true} variant="outlined" placeholder="Why this guess?" onChange={(e) => { evalPairReason = e.target.value; }}>
              </TextField>
            </Grid>
            <Grid item>
              <div>
                <Button color='primary' variant="contained" className={classes.actionButton} onClick={evalInputOutputPair}>
                  Submit
                </Button>
              </div>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Grid container spacing={4} direction="column">
          <Grid item>
            <TextField multiline={true} rows={4} fullWidth={true} variant="outlined" placeholder="What do you think this function does?" onChange={(e) => { finalGuess = e.target.value; }} ref={(elem) => { guessField = elem; }}>
            </TextField>
          </Grid>
          <Grid item>
            <div>
              <Button color='primary' variant="contained" className={classes.actionButton} onClick={showAnswer}>
                SUBMIT FINAL GUESS AND SEE ANSWER
                </Button>
            </div>
          </Grid>
          <Grid item>
            {toNextPageButton()}
          </Grid>
        </Grid>
      </TabPanel>
    </div >
  );
}
