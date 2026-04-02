// CLI : npm install axios --save
import axios from 'axios';
import './App.css';
import React, { Component } from 'react';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';
<<<<<<< HEAD
import MyProvider from './contexts/MyProvider';

=======
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Loading...'
    };
  }

  render() {
    return (
<<<<<<< HEAD
      <MyProvider>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </MyProvider>
=======
      <BrowserRouter>
        <Main />
      </BrowserRouter>
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
    );
  }

  componentDidMount() {
    // Sửa lỗi cú pháp hàm mũi tên và khoảng trắng
    axios.get('/hello')
      .then((res) => {
        const result = res.data;
        this.setState({ message: result.message });
      })
      .catch((error) => {
        console.error("Lỗi kết nối:", error);
        this.setState({ message: "Lỗi tải dữ liệu" });
      });
  }
}

export default App;