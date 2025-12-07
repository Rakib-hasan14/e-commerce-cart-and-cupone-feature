const express = require('express');
const cartRoutes = require('./cart/cart.route');

const router = express.Router();

router.use('/cart', cartRoutes);

module.exports = router;
