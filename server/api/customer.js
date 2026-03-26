const express = require('express');
const router = express.Router();

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const CustomerDAO = require('../models/CustomerDAO');
const OrderDAO = require('../models/OrderDAO');
// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');
const JwtUtil = require('../utils/JwtUtil');

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
        console.log('POST /api/customer/signup body:', req.body);

        // normalize inputs
        const username = req.body.username ? req.body.username.trim() : '';
        const password = req.body.password;
        const name = req.body.name;
        const phone = req.body.phone;
        const email = req.body.email ? req.body.email.trim().toLowerCase() : '';

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
                res.json({ success: true, message: 'Please check email to activate your account' });
            } else {
                // email not configured: auto-activate for development
                await CustomerDAO.active(result._id, token, 1);
                console.log('[DEV] Email not configured. Auto-activated account for:', email);
                res.json({ success: true, message: 'Registration successful! ' });
            }
        } else {
            res.json({ success: false, message: 'Insert failure' });
        }
    } catch (err) {
        console.error('POST /api/customer/signup error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// customer
router.post('/login', async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        const customer = await CustomerDAO.selectByUsernameAndPassword(username, password);

        if (customer) {
            if (customer.active === 1) {
                // generate token including username and password (keeps same shape as admin token)
                const token = JwtUtil.genToken(username, password);

                res.json({
                    success: true,
                    message: 'Authentication successful',
                    token: token,
                    customer: customer
                });
            } else {
                res.json({ success: false, message: 'Account is deactive' });
            }
        } else {
            res.json({ success: false, message: 'Incorrect username or password' });
        }
    } else {
        res.json({ success: false, message: 'Please input username and password' });
    }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    res.json({
        success: true,
        message: 'Token is valid',
        token: token
    });
});
// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
    const _id = req.params.id;
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;

    const customer = {
        _id: _id,
        username: username,
        password: password,
        name: name,
        phone: phone,
        email: email
    };

    const result = await CustomerDAO.update(customer);
    res.json(result);
});
// checkout (create order) - protect with token
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
    try {
        const now = new Date().getTime();
        const total = req.body.total || 0;
        const items = req.body.items || [];
        // client may send customer info or we can read from token payload in future
        const customer = req.body.customer || null;

        const order = {
            cdate: now,
            total: total,
            status: 'PENDING',
            customer: customer,
            items: items
        };

        const result = await OrderDAO.insert(order);
        res.json(result);
    } catch (err) {
        console.error('POST /api/customer/checkout error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});
// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
    const _cid = req.params.cid;
    const orders = await OrderDAO.selectByCustID(_cid);
    res.json(orders);
});

module.exports = router;