import React, { Component } from 'react';
import MyContext from './MyContext';

class MyProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { // global state
      // variables
      mycart: [],
      token: '',
      customer: null,

      // functions
      setMyCart: this.setMyCart,
      setToken: this.setToken,
      setCustomer: this.setCustomer
    };
  }
  setMyCart = (value) => {
    this.setState({ mycart: value });
  }


  setToken = (value) => {
    this.setState({ token: value });
  }

  setCustomer = (value) => {
    this.setState({ customer: value });
  }

  render() {
    return (
      <MyContext.Provider value={this.state}>
        {this.props.children}
      </MyContext.Provider>
    );
  }
}

export default MyProvider;