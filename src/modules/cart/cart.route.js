const express = require('express');
const cartController = require('./cart.controller');

const router = express.Router();

router.post('/', cartController.createCart);
router.get('/:id', cartController.getCart);

module.exports = router;
