const express = require('express');
const {getAllProducts} = require('./productController.js')
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello from crud");
});

app.get('/products', getAllProducts);

module.exports = app;
