const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');
// login
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const admin = await AdminDAO.selectByUsernameAndPassword(
        username,
        password
      );

      if (admin) {
        const token = JwtUtil.genToken(username, password);
        res.json({
          success: true,
          message: 'Authentication successful',
          token: token
        });
      } else {
        res.json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } catch (err) {
      console.error('Error during admin login:', err);
      res.status(500).json({
        success: false,
        message: 'Server error while accessing database'
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Please input username and password'
    });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });
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
const mongoose = require('mongoose');
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body && req.body.name ? req.body.name.trim() : '';

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  if (!mongoose.isValidObjectId(_id)) {
    console.warn('Invalid category id for update:', _id);
    return res.status(400).json({ success: false, message: 'Invalid category id' });
  }

  try {
    console.log('Updating category id=', _id, 'name=', name);
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

  if (!mongoose.isValidObjectId(_id)) {
    console.warn('Invalid category id for delete:', _id);
    return res.status(400).json({ success: false, message: 'Invalid category id' });
  }

  try {
    console.log('Deleting category id=', _id);
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

// create product (protected)
router.post('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    const name = req.body && req.body.name ? req.body.name.trim() : '';
    const price = req.body && typeof req.body.price !== 'undefined' ? Number(req.body.price) : null;
    const cid = req.body && req.body.category ? req.body.category : '';
    const image = req.body && req.body.image ? req.body.image : '';

    if (!name || price === null || !cid) {
      return res.status(400).json({ success: false, message: 'name, price and category are required' });
    }

    if (!mongoose.isValidObjectId(cid)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const category = await CategoryDAO.selectById(cid);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const now = new Date().getTime();
    const product = {
      name: name,
      price: price,
      image: image,
      cdate: now,
      category: category
    };

    const result = await ProductDAO.insert(product);
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('Error creating product:', err);
    return res.status(500).json({ success: false, message: 'Server error creating product' });
  }
});
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  try {
    const _id = req.params.id;
    const name = req.body.name;
    const price = req.body.price;
    const cid = req.body.category;
    const image = req.body.image;
    const now = new Date().getTime(); // milliseconds

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    if (!mongoose.isValidObjectId(cid)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const category = await CategoryDAO.selectById(cid);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const product = {
      _id: _id,
      name: name,
      price: price,
      image: image,
      cdate: now,
      category: category
    };

    const result = await ProductDAO.update(product);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});


// list products (protected) with pagination
router.get('/products', JwtUtil.checkToken, async function (req, res) {
  try {
    var products = await ProductDAO.selectAll();
    const sizePage = 4;
    const noPages = Math.ceil(products.length / sizePage) || 1;

    var curPage = 1;
    if (req.query.page) {
      curPage = parseInt(req.query.page) || 1; // /products?page=xxx
    }

    const offset = (curPage - 1) * sizePage;
    const pageData = products.slice(offset, offset + sizePage);

    return res.json({ products: pageData, noPages: noPages, curPage: curPage });
  } catch (err) {
    console.error('Error listing products:', err);
    return res.status(500).json({ success: false, message: 'Server error listing products' });
  }
});

// update product (protected)
router.put('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  try {
    const name = req.body && req.body.name ? req.body.name.trim() : '';
    const price = req.body && typeof req.body.price !== 'undefined' ? Number(req.body.price) : null;
    const cid = req.body && req.body.category ? req.body.category : '';
    const image = req.body && req.body.image ? req.body.image : '';

    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }

    if (!name || price === null || !cid) {
      return res.status(400).json({ success: false, message: 'name, price and category are required' });
    }

    if (!mongoose.isValidObjectId(cid)) {
      return res.status(400).json({ success: false, message: 'Invalid category id' });
    }

    const category = await CategoryDAO.selectById(cid);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const prod = { _id: _id, name: name, price: price, image: image, category: category };
    const result = await ProductDAO.update(prod);
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ success: false, message: 'Server error updating product' });
  }
});

// delete product (protected)
router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  try {
    if (!mongoose.isValidObjectId(_id)) {
      return res.status(400).json({ success: false, message: 'Invalid product id' });
    }
    const result = await ProductDAO.delete(_id);
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});

router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;

  if (!mongoose.isValidObjectId(_id)) {
    return res.status(400).json({ success: false, message: 'Invalid product id' });
  }

  try {
    const result = await ProductDAO.delete(_id);
    if (result) {
      res.json({ success: true, data: result });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ success: false, message: 'Server error deleting product' });
  }
});
// order
router.get('/orders', JwtUtil.checkToken, async function (req, res) {
  const orders = await OrderDAO.selectAll();
  res.json(orders);
});
// order
router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const newStatus = req.body.status;

  const result = await OrderDAO.update(_id, newStatus);
  res.json(result);
});


module.exports = router;