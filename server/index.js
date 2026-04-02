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

<<<<<<< HEAD
// deployment
const path = require('path');
// '/admin' serve the files at client-admin/build/* as static files
app.use('/admin', express.static(path.resolve(__dirname, '../client-admin/build')));
app.get('admin/*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-admin/build', 'index.html'));
});
// '/' serve the files at client-customer/build/* as static files
app.use('/', express.static(path.resolve(__dirname, '../client-customer/build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client-customer/build', 'index.html'));
});

=======
>>>>>>> a407f80146ef3937f4c679a1e1434a8fe160b401
// start server AFTER all routes/middleware registered
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});