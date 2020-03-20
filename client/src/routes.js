import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import GuessingScreen from './screens/GuessingScreen'
import StartScreen from './screens/StartScreen'
import SumBetween from './functions/SumBetween'
import ThankYouScreen from './screens/ThankYouScreen'
import Average from './functions/Average'
import Median from './functions/Median'
import SecondIntoFirstDivisible from './functions/SecondIntoFirstDivisible'
import FirstIntoSecondDivisible from './functions/FirstIntoSecondDivisible'
import SumParityBool from './functions/SumParityBool';
import SumParityInt from './functions/SumParityInt';
import Induced from './functions/Induced';
import IsDag from './predicates/IsDag'
import ThreeCycle from './predicates/ThreeCycle'
import IsBipartite from './predicates/IsBipartite'

import { InputBase } from '@material-ui/core'

function coinFlip(first, second) {
  const flip = Math.random()
  if (flip < .5) {
    return first
  } else {
    return second
  }
}

// Shuffles an array. https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

// Logic to randomize screen order would go here
// -> have a start page that is just a button
// have an array of random paths and also funcObjs
// shuffle the funcObjs, and then assign at random with the links 
// with the indices
var funcs = []
funcs.push(IsDag)
funcs.push(ThreeCycle)
funcs.push(IsBipartite)
// shuffle(funcs)

export default props => (
  <HashRouter>
    <Switch>
      <Route exact path='/' render={(props) => <StartScreen {...props} nextPage='/first'></StartScreen>} />
      <Route exact path='/first' render={(props) => <GuessingScreen {...props} funcObj={funcs[0]} nextPage={'/second'} current={0} total={funcs.length}></GuessingScreen>} />
      <Route exact path='/second' render={(props) => <GuessingScreen {...props} funcObj={funcs[1]} nextPage={'/third'} current={1} total={funcs.length}></GuessingScreen>} />
      <Route exact path='/third' render={(props) => <GuessingScreen {...props} funcObj={funcs[2]} nextPage={'/fourth'} current={2} total={funcs.length}></GuessingScreen>} />
      <Route exact path='/thanks' render={(props) => <ThankYouScreen></ThankYouScreen>} />
    </Switch>
  </HashRouter>
)