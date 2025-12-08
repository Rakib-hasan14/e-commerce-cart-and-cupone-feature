const express = require('express');
const cartController = require('src/modules/cart/cart.controller');

const router = express.Router();

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:id', cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);
router.post('/coupon', cartController.applyCoupon);
router.delete('/coupon', cartController.removeCoupon);
router.post('/checkout', cartController.checkout);

module.exports = router;
