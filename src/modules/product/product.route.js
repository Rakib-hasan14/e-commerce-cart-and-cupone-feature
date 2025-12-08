const express = require('express');
const productController = require('src/modules/product/product.controller');

const router = express.Router();

router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);

module.exports = router;
