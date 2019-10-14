import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import GuessingScreen from './screens/GuessingScreen'
import StartScreen from './screens/StartScreen'
import IsPalindromeInts from './functions/IsPalindrome'
import MakePalindrome from './functions/MakePalindrome';
import SumParity from './functions/SumParity';


// Logic to randomize screen order would go here
// -> have a start page that is just a button
// have an array of random paths and also funcObjs
// shuffle the funcObjs, and then assign at random with the links 

export default props => (
  <HashRouter>
    <Switch>
      <Route exact path='/' render={(props) => <StartScreen {...props} nextPage='/first'></StartScreen>} />
      <Route exact path='/first' render={(props) => <GuessingScreen {...props} funcObj={IsPalindromeInts} nextPage={'/second'}></GuessingScreen>} />
      <Route exact path='/second' render={(props) => <GuessingScreen {...props} funcObj={MakePalindrome} nextPage={'/third'}></GuessingScreen>} />
      <Route exact path='/third' render={(props) => <GuessingScreen {...props} funcObj={SumParity}></GuessingScreen>} />
    </Switch>
  </HashRouter>
)