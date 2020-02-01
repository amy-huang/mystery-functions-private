import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import withStyles from '@material-ui/styles/withStyles';
import { Button } from '@material-ui/core';
import Display from './Display'

const styles = theme => ({
  text: {
    fontSize: 14,
  },
});

class EvalInputLine extends Component {
  render() {
    var classes = this.props;
    return (
      <Grid container direction="row" spacing={2} justify="flex-start" height={20} alignItems="center" alignContent="center">
        <Grid item>
          <Display>{classes.in}</Display>
        </Grid>
        <Grid item>
          <Typography className={classes.text}>evaluates to</Typography>
        </Grid>
        <Grid item>
        <Display>{classes.out}</Display>
        </Grid>
      </Grid>
    )
  }
}

export default withRouter(withStyles(styles)(EvalInputLine));