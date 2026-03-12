const express = require('express');
const router = express.Router();

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');

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
// product search (by keyword) - implemented below with try/catch
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

// customer: activate account
router.post('/active', async function (req, res) {
        try {
                const _id = req.body.id;
                const token = req.body.token;
                if (!_id || !token) return res.status(400).json({ success: false, message: 'Missing id or token' });

                const result = await CustomerDAO.active(_id, token, 1);
                if (result) res.json({ success: true, message: 'Account activated' });
                else res.status(400).json({ success: false, message: 'Invalid id or token' });
        } catch (err) {
                console.error('POST /api/customer/active error:', err);
                res.status(500).json({ error: 'Server error' });
        }
});

// customer: signup
router.post('/signup', async function (req, res) {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email;

        const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

        if (dbCust) {
            return res.json({ success: false, message: 'Exists username or email' });
        }

        const now = new Date().getTime(); // milliseconds
        const token = CryptoUtil.md5(now.toString());

        const newCust = {
            username: username,
            password: password,
            name: name,
            phone: phone,
            email: email,
            active: 0,
            token: token
        };

        const result = await CustomerDAO.insert(newCust);

        if (result) {
            const send = await EmailUtil.send(email, result._id, token);

            if (send) {
                res.json({ success: true, message: 'Please check email' });
            } else {
                res.json({ success: false, message: 'Email failure' });
            }
        } else {
            res.json({ success: false, message: 'Insert failure' });
        }
    } catch (err) {
        console.error('POST /api/customer/signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;