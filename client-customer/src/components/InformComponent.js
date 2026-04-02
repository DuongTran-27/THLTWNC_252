import React, { Component } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import MyContext from '../contexts/MyContext';

class Inform extends Component {
    static contextType = MyContext;
=======

class Inform extends Component {
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
    render() {
        return (
            <div className="border-bottom">
                <div className="float-left">
<<<<<<< HEAD
                {this.context.token === '' ?
          <div>
            <Link to="/login">Login</Link> |
            <Link to="/signup">Sign-up</Link> |
            <Link to="/active">Active</Link>
          </div>
          :
          <div>
            Hello <b>{this.context.customer?.name || ''}</b> |
            <Link to="/home" onClick={() => this.lnkLogoutClick()}>Logout</Link> |
            <Link to="/myprofile">My profile</Link> |
            <Link to="/myorders">My orders</Link>
          </div>
        }
            </div>

            <div className="float-right">
                <Link to='/mycart'>My cart</Link> have <b>{this.context.mycart.length}</b> items
=======
                <Link to=''>Login</Link> | 
                <Link to=''>Sign-up</Link> | 
                <Link to=''>Active</Link>
            </div>

            <div className="float-right">
                <Link to=''>My cart</Link> have <b>0</b> items
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
            </div>

                <div className="float-clear" />
            </div>
        );
    }
<<<<<<< HEAD
    // event-handlers
  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setCustomer(null);
    this.context.setMyCart([]);
  }
  
=======
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
}

export default Inform;