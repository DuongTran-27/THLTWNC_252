const express = require('express');
const router = express.Router();

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');

// category
router.get('/categories', async function (req, res) {
    try {
        const categories = await CategoryDAO.selectAll();
        res.json(categories);
    } catch (err) {
        console.error('GET /api/customer/categories error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// product
router.get('/products/new', async function (req, res) {
    try {
        const top = parseInt(req.query.top) || 3;
        const products = await ProductDAO.selectTopNew(top);
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products/new error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// product
router.get('/products/category/:cid', async function (req, res) {
    try {
        const _cid = req.params.cid;
        const products = await ProductDAO.selectByCatID(_cid);
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products/category/:cid error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// product
router.get('/products/search/:keyword', async function (req, res) {
    const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
    res.json(products);
});
router.get('/products/hot', async function (req, res) {
    try {
        const top = parseInt(req.query.top) || 3;
        const products = await ProductDAO.selectTopHot(top);
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products/hot error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// get product by id
router.get('/products/:id', async function (req, res) {
    try {
        const id = req.params.id;
        const product = await ProductDAO.selectById(id);
        if (!product) return res.status(404).json({ error: 'Not found' });
        res.json(product);
    } catch (err) {
        console.error('GET /api/customer/products/:id error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// search products by keyword (name contains)
router.get('/products/search/:keyword', async function (req, res) {
    try {
        const keyword = req.params.keyword;
    const products = await ProductDAO.selectByKeyword(keyword);
        res.json(products);
    } catch (err) {
        console.error('GET /api/customer/products/search/:keyword error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// product
router.get('/products/:id', async function (req, res) {
    const _id = req.params.id;
    const product = await ProductDAO.selectByID(_id);
    res.json(product);
});

module.exports = router;