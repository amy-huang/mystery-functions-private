import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import GuessingScreen from './components/GuessingScreen'

export default props => (
  <HashRouter>
    <Switch>
      <Route exact path='/' component={GuessingScreen}/>
    </Switch>
  </HashRouter>
)