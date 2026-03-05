// CLI : npm install axios --save
import axios from 'axios';
import './App.css';
import React, { Component } from 'react';
import Main from './components/MainComponent';
import { BrowserRouter } from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Loading...'
    };
  }

  render() {
    return (
      <BrowserRouter>
        <Main />
      </BrowserRouter>
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