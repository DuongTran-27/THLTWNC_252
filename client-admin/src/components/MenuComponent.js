import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';

class Menu extends Component {
  static contextType = MyContext;

  render() {
    return (
      <div className="border-bottom">
        <div className="float-left">
          <ul className="menu">
            <li className="menu"><Link to="/admin/home">Home</Link></li>
<<<<<<< HEAD

=======
            
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
            <li className="menu"><Link to="/admin/product">Product</Link></li>
            <li className="menu"><Link to="/admin/order">Order</Link></li>
            <li className="menu"><Link to="/admin/customer">Customer</Link></li>
            <li className="menu"><Link to="/admin/category">Category</Link></li>
<<<<<<< HEAD
            <li className="menu"><Link to="/admin/order">Token</Link></li>


=======
            
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
          </ul>
        </div>

        <div className="float-right">
<<<<<<< HEAD
          <Link to="/admin/home" onClick={() => this.lnkLogoutClick()}>Logout</Link>
          Hello <b>{this.context.username}</b> |{' '}

=======
            <Link to="/admin/home" onClick={() => this.lnkLogoutClick()}>Logout</Link>
          Hello <b>{this.context.username}</b> |{' '}
          
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
        </div>

        <div className="float-clear"></div>
      </div>
    );
  }

  lnkLogoutClick() {
    this.context.setToken('');
    this.context.setUsername('');
  }
}

export default Menu;
