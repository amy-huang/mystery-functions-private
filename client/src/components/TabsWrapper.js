import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Tabs from './Tabs.js';

class TabsWrapper extends Component {
  render() {
    const children = {
      guesses: this.props.guesses,
      updateFunc: this.props.updateFunc
    };
    return (
      <Tabs>{children}</Tabs>
    );
  }
}
export default withRouter(TabsWrapper);