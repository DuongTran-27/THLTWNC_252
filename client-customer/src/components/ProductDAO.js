import axios from 'axios';

// Client-side Product API wrapper for the customer app
const ProductDAO = {
  getCategories() {
    return axios.get('/api/customer/categories').then((r) => r.data);
  },

  getTopNew(top = 3) {
    return axios.get(`/api/customer/products/new?top=${top}`).then((r) => r.data);
  },

  getTopHot(top = 3) {
    return axios.get(`/api/customer/products/hot?top=${top}`).then((r) => r.data);
  },

  getByCategory(cid) {
    return axios.get(`/api/customer/products/category/${cid}`).then((r) => r.data);
  }
};

export default ProductDAO;
