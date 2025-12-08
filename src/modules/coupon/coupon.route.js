const express = require('express');
const couponController = require('src/modules/coupon/coupon.controller');

const router = express.Router();

router.post('/', couponController.createCoupon);
router.get('/', couponController.getAllCoupons);

module.exports = router;
