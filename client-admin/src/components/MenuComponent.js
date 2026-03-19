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
            
            <li className="menu"><Link to="/admin/product">Product</Link></li>
            <li className="menu"><Link to="/admin/order">Order</Link></li>
            <li className="menu"><Link to="/admin/customer">Customer</Link></li>
            <li className="menu"><Link to="/admin/category">Category</Link></li>
            <li className="menu"><Link to="/admin/order">Token</Link></li>
            
          </ul>
        </div>

        <div className="float-right">
            <Link to="/admin/home" onClick={() => this.lnkLogoutClick()}>Logout</Link>
          Hello <b>{this.context.username}</b> |{' '}
          
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
