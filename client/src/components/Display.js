import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import withStyles from '@material-ui/styles/withStyles';
import { Grid, Button } from "@material-ui/core";
import { green, red } from '@material-ui/core/colors';
import Integer from '../types/Integer'
import ListOfInteger from '../types/ListOfInteger'
import Bool from '../types/Bool'
import Str from '../types/Str'
import Float from '../types/Float'

const styles = theme => ({
    text: {
      fontSize: 14,
    },
    primary: green,
    secondary: red,
  });

class Display extends Component {
    render() {
        var evalStr = this.props.children
        if (ListOfInteger.valid(evalStr) === true) {
            return (
            <Button variant="contained"> <Typography >{evalStr}</Typography> </Button>
            )
        }
        else if (Integer.valid(evalStr) === true) {
            return (
                <Button variant="contained"> <Typography >{evalStr}</Typography> </Button>
                )
        }
        else if (Float.valid(evalStr) === true) {
            return (
                <Button variant="contained"> <Typography >{evalStr}</Typography> </Button>
                )
        }
        else if (Str.valid(evalStr) === true) {
            return (
                <Button variant="contained"> <Typography >{evalStr}</Typography> </Button>
                )
        }
        else if (Bool.valid(evalStr) === true) {
            if (Bool.parse(evalStr) === true) {
                return (
                    <Button variant="contained"> <Typography >{evalStr}</Typography> </Button>
                    )
            } else {
                return (
                    <Button variant="contained"> <Typography >{evalStr}</Typography> </Button>
                    )
            }
        }
        else {
            if (evalStr.includes("and")) {
                var parts = evalStr.split("and")
                var first = parts[0].trim()
                var second = parts[1].trim()
                return (
                    <Grid spacing={1} container direction="row" alignItems="center">
                        <Grid item>
                            <Button variant="contained"> <Typography >{first}</Typography> </Button>
                        </Grid>
                        <Grid item>
                        <Typography > and </Typography>
                        </Grid>
                        <Grid item>
                            <Button variant="contained"> <Typography >{second}</Typography> </Button>
                        </Grid>
                    </Grid>
                )
            } else {
                return (
                    <Button>asdf</Button>
                )
            }
        }
    }
}

export default withRouter(withStyles(styles)(Display));