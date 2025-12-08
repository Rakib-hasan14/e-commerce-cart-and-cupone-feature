const Product = require('src/modules/product/product.entity');
const Cart = require('src/modules/cart/cart.entity');
const CartItem = require('src/modules/cart/cart-item.entity');
const Coupon = require('src/modules/coupon/coupon.entity');
const CouponRule = require('src/modules/coupon/coupon-rule.entity');
const CouponUsage = require('src/modules/coupon/coupon-usage.entity');

// Relations

// Cart <-> CartItem
Cart.hasMany(CartItem, { foreignKey: 'cart_id', as: 'items' });
CartItem.belongsTo(Cart, { foreignKey: 'cart_id' });

// Product <-> CartItem
Product.hasMany(CartItem, { foreignKey: 'product_id' });
CartItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

// Cart <-> Coupon
Coupon.hasMany(Cart, { foreignKey: 'coupon_id' });
Cart.belongsTo(Coupon, { foreignKey: 'coupon_id', as: 'coupon' });

// Coupon <-> CouponRule
Coupon.hasMany(CouponRule, { foreignKey: 'coupon_id', as: 'rules' });
CouponRule.belongsTo(Coupon, { foreignKey: 'coupon_id' });

// Coupon <-> CouponUsage
Coupon.hasMany(CouponUsage, { foreignKey: 'coupon_id', as: 'usages' });
CouponUsage.belongsTo(Coupon, { foreignKey: 'coupon_id' });

module.exports = {
    Product,
    Cart,
    CartItem,
    Coupon,
    CouponRule,
    CouponUsage,
};
