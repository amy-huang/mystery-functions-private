import React, { Component } from 'react';
import withStyles from '@material-ui/styles/withStyles';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TabsWrapper from '../components/TabsWrapper';
import Paper from '@material-ui/core/Paper';
import { GridList, GridListTile } from '@material-ui/core';
import EvalGuessLine from '../components/EvalGuessLine';
import EvalInputLine from '../components/EvalInputLine';
import DummyLine from '../components/DummyLine';

const gridListHeight = 500;

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

// Creates blank tiles to go in the console gridlist, so that new submissions
// appear at the bottom and not the top 
function dummyTiles() {
  var guesses = [];
  var numTiles = gridListHeight / 80
  for (var i = -1 * numTiles; i < 0; i++) {
    guesses.push({
      key: i,
      type: "dummy_line"
    });
  }
  return guesses;
}

class GuessingScreen extends Component {
  guesses = dummyTiles();
  scrolling = false;
  scrollId;

  // If not at bottom of screen yet, scroll; stop repeated call if reached
  scrollDown = () => {
    if (this.gridlist === null) {
      return;
    }
    if (this.gridlist.scrollTop < this.gridlist.scrollHeight - gridListHeight) {
      this.gridlist.scrollTop += 5;
    } else {
      clearInterval(this.scrollId);
      this.scrolling = false;
    }
  }

  // Update the guesses list shown in the console, and scroll down to new guess
  guessMade = () => {
    this.setState({ guesses: this.guesses, scrollId: this.scrollId, scrolling: this.scrolling });
    if (!this.scrolling) {
      this.scrollId = setInterval(this.scrollDown, 10);
      this.scrolling = true;
    }
  }

  getLine(tile, gridlist) {
    if (tile.type === "dummy_line") {
      return (
        <DummyLine></DummyLine>
      );
    }
    if (tile.type === "eval_input") {
      return (
        <EvalInputLine in={tile.in} out={tile.out}></EvalInputLine>
      );
    }
    if (tile.type === "eval_pair") {
      return (
        <Grid container spacing={1}>
          <Grid item>
            <EvalGuessLine in={tile.in} out={tile.out} result={tile.result}></EvalGuessLine>
          </Grid>
          <Grid item><i>({tile.reason})</i></Grid>
        </Grid>
      );
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        < div className={classes.root} >
          {/* Center all Grids */}
          < Grid container justify="center" spacing={4}>

            {/* Left half panel */}
            < Grid container item spacing={4} className={classes.panel} alignContent="flex-start" >
              {/* Function signature */}
              < Grid item xs={12} >
                <Typography color='secondary' gutterBottom >
                  This mystery function takes an input of type
                  <ul>
                    <li>
                      {this.props.funcObj.inputType()}
                    </li>
                  </ul>
                  and an output of type
                  <ul>
                    <li>
                      {this.props.funcObj.outputType()}
                    </li>
                  </ul>
                </Typography>
              </Grid>

              <Grid item xs={12} >
                <TabsWrapper guesses={this.guesses} funcObj={this.props.funcObj} updateFunc={this.guessMade} nextPage={this.props.nextPage}></TabsWrapper>
              </Grid>
            </Grid>

            <Grid container item spacing={4} className={classes.panel}>
              <Paper className={classes.paper}>
                <div className={classes.gridListWrapper}>
                  <Grid container spacing={4} alignContent="center">
                    <Grid item>
                      <GridList className={classes.gridList} cellHeight={60} cols={1} ref={(elem) => { this.gridlist = elem; }}>
                        {this.guesses.map(tile => (
                          <GridListTile key={tile.key} cols={1}>
                            {this.getLine(tile)}
                          </GridListTile>
                        ))}
                      </GridList>
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

export default withRouter(withStyles(styles)(GuessingScreen));