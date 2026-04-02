const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
<<<<<<< HEAD

const CustomerDAO = require('../models/CustomerDAO');

// customers
router.get('/customers', JwtUtil.checkToken, async function (req, res) {
  const customers = await CustomerDAO.selectAll();
  res.json(customers);
});
// orders
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.query.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});
=======
const CategoryDAO = require ('../models/CategoryDAO') ;
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401

// list
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  var products = await ProductDAO.selectAll();

  const sizePage = 4;
  const noPages = Math.ceil(products.length / sizePage);

  var curPage = 1;
  if (req.query.page) curPage = parseInt(req.query.page);

  const offset = (curPage - 1) * sizePage;
  products = products.slice(offset, offset + sizePage);

  const result = {
    products: products,
    noPages: noPages,
    curPage: curPage
  };
  res.json(result);
});

// add
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.insert(product);
  res.json(result);
});

// update
router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;
  const now = new Date().getTime();

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});

// delete
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const result = await ProductDAO.delete(_id);
  res.json(result);
});

// category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
});

// get one category by id (protected)
router.get('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  try {
    const category = await CategoryDAO.selectById(_id);
    if (category) {
      return res.json({ success: true, data: category });
    } else {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error fetching category by id:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching category' });
  }
});

// create category (protected)
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body && req.body.name ? req.body.name.trim() : '';
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const category = { name: name };
    const result = await CategoryDAO.insert(category);
    // return created resource (or DAO result)
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ success: false, message: 'Server error creating category' });
  }
});

// update category (protected)
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body && req.body.name ? req.body.name.trim() : '';

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const category = { _id: _id, name: name };
    const result = await CategoryDAO.update(category);
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error updating category:', err);
    return res.status(500).json({ success: false, message: 'Server error updating category' });
  }
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  try {
    const result = await CategoryDAO.delete(_id);
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting category' });
  }
});

// product
router.put('/products', JwtUtil.checkToken, async function (req, res) {
  const _id = req.body.id;
  const name = req.body.name;
  const price = req.body.price;
  const cid = req.body.category;
  const image = req.body.image;

  const now = new Date().getTime(); // milliseconds

  const category = await CategoryDAO.selectByID(cid);

  const product = {
    _id: _id,
    name: name,
    price: price,
    image: image,
    cdate: now,
    category: category
  };

  const result = await ProductDAO.update(product);
  res.json(result);
});

module.exports = router;