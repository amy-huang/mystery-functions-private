import React, { Component } from 'react'
import withStyles from '@material-ui/styles/withStyles'
import { withRouter, Link } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { TextField, Typography } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBContainer, MDBView, MDBMask, MDBCarouselCaption, MDBRow, MDBCol, MDBCard, MDBCardImage,
    MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn } from "mdbreact";
import img from '../pics/tiktok.png'

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

class IntroScreen extends Component {
  constructor(props) {
    super(props)
  }

  goToStart = () => {
   this.props.history.push(this.props.nextPage)
  }

  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <CssBaseline />
        < div className={classes.root} >
          {/* Center all Grids */}
          < Grid container spacing={4} alignItems="center" direction="column">

            <Grid item spacing={4} className={classes.panel}>
              <Paper className={classes.paper}>
                <img src={img} alt="hi" />
              </Paper>
            </Grid>

            <Grid item spacing={4} className={classes.panel}>
              <Paper className={classes.paper}>
                <Button type="submit" onClick={this.goToStart}>
                Begin!
                </Button>
              </Paper>
            </Grid>

          </Grid>
        </div>
      </React.Fragment >
    )
  }
}

export default withRouter(withStyles(styles)(IntroScreen))