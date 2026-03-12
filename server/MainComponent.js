import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';

class Main extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Home />
        </div>
      );
    }

    return <div />;
  }
}

export default Main;
