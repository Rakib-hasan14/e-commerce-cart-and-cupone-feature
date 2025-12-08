const express = require('express');
const cartRoutes = require('src/modules/cart/cart.route');
const productRoutes = require('src/modules/product/product.route');
const couponRoutes = require('src/modules/coupon/coupon.route');

const router = express.Router();

router.use('/cart', cartRoutes);
router.use('/products', productRoutes);
router.use('/coupons', couponRoutes);

module.exports = router;
