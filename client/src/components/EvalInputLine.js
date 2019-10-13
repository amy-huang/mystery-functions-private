import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import withStyles from '@material-ui/styles/withStyles';


const styles = theme => ({
  text: {
    fontSize: 14,
  },
});

class EvalInputLine extends Component {
  render() {
    var classes = this.props;
    return (
      <Grid container direction="row" spacing={1} justify="flex-start" height={20}>
        <Grid item>
          <Typography className={classes.text}>{JSON.stringify(classes.in)}</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.text}>evaluates to</Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.text}>{JSON.stringify(classes.out)}</Typography>
        </Grid>
      </Grid>
    )
  }
}

export default withRouter(withStyles(styles)(EvalInputLine));