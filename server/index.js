// CLI: npm install express body-parser --save
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// apis
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

// simple request logger to aid debugging
app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.originalUrl);
    next();
});

// apis
app.use('/api/admin', require('./api/admin.js'));
// customer routes
app.use('/api/customer', require('./api/customer.js'));

// start server AFTER all routes/middleware registered
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});