import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Login from './LoginComponent';
<<<<<<< HEAD
import { Routes, Route, Navigate } from 'react-router-dom';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';
=======
import { Routes , Route , Navigate } from 'react-router-dom';
import Category from './CategoryComponent';
import Product from './ProductComponent';
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401

class Main extends Component {
  static contextType = MyContext; // using this.context to access global state

  render() {
    // If authenticated, show the admin routes (home, category, etc.)
    if (this.context.token !== '') {
      return (
        <div className="body-admin">
          <Menu />
          <Routes>
            <Route path="/admin" element={<Navigate replace to="/admin/home" />} />
            <Route path="/admin/home" element={<Home />} />
            <Route path="/admin/category" element={<Category />} />
            <Route path="/admin/product" element={<Product />} />
<<<<<<< HEAD
            <Route path="/admin/order" element={<Order />} />
            <Route path="/admin/customer" element={<Customer />} />
=======
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
          </Routes>
        </div>
      );
    }

    // If not authenticated, show the login form
    return (
      <div className="body-admin">
        <Menu />
        <Login />
      </div>
    );
  }
}
export default Main;
