const { Coupon, CouponRule, CouponUsage } = require('src/modules/entities');
const { Op } = require('sequelize');
const { AppError } = require('src/utils/AppError');

const getCouponByCode = async (code) => {
    return await Coupon.findOne({
        where: { code },
        include: ['rules'],
    });
};

const validateCoupon = async (coupon, cartContext) => {
    const now = new Date();

    // 1. Basic Checks
    if (!coupon) throw new AppError('Invalid coupon code', 400);
    if (now < coupon.start_date) throw new AppError('Coupon is not yet active', 400);
    if (now > coupon.expiry_date) throw new AppError('Coupon has expired', 400);
    if (coupon.usage_limit !== null && coupon.usage_count >= coupon.usage_limit) {
        throw new AppError('Coupon usage limit reached', 400);
    }

    // 2. User Usage Limit
    if (cartContext.user_id) {
        const userUsage = await CouponUsage.count({
            where: { coupon_id: coupon.id, user_id: cartContext.user_id }
        });
        if (userUsage >= coupon.user_usage_limit) {
            throw new AppError('You have reached the usage limit for this coupon', 400);
        }
    }

    // 3. Rule Validation
    if (coupon.rules && coupon.rules.length > 0) {
        for (const rule of coupon.rules) {
            validateRule(rule, cartContext);
        }
    }

    return true;
};

const validateRule = (rule, cartContext) => {
    const { subtotal, items } = cartContext;
    const value = rule.value; // JSONB

    switch (rule.rule_type) {
        case 'min_cart_amount':
            if (value.amount === undefined || value.amount === null) return; // Should probably throw or ignore? Assuming ignore if malformed.
            if (parseFloat(subtotal) < parseFloat(value.amount)) {
                throw new AppError(`Minimum cart amount of ${value.amount} required`, 400);
            }
            break;
        case 'min_cart_items':
            if (value.count === undefined || value.count === null) return;
            const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
            if (totalItems < parseInt(value.count)) {
                throw new AppError(`Minimum ${value.count} items required`, 400);
            }
            break;
        case 'product_restriction':
            // Example: value.product_ids = ["uuid1", "uuid2"]
            // Check if cart contains ANY of these products (or ALL, depending on logic. Usually ANY or REQUIRED).
            // Let's assume "Required to be in cart"
            if (!value.product_ids || !Array.isArray(value.product_ids)) return;
            const hasProduct = items.some(item => value.product_ids.includes(item.product_id));
            if (!hasProduct) {
                throw new AppError('Required product for this coupon is missing', 400);
            }
            break;
        // Add more rules as needed
    }
};

const findBestAutoCoupon = async (cartContext) => {
    const now = new Date();
    const autoCoupons = await Coupon.findAll({
        where: {
            type: 'auto_applied',
            start_date: { [Op.lte]: now },
            expiry_date: { [Op.gte]: now },
        },
        include: ['rules'],
    });

    let bestCoupon = null;
    let maxDiscount = -1;

    for (const coupon of autoCoupons) {
        try {
            await validateCoupon(coupon, cartContext);

            // Calculate potential discount
            let discount = 0;
            if (coupon.discount_type === 'fixed') {
                discount = parseFloat(coupon.discount_value);
            } else {
                discount = cartContext.subtotal * (parseFloat(coupon.discount_value) / 100);
            }

            if (discount > maxDiscount) {
                maxDiscount = discount;
                bestCoupon = coupon;
            }
        } catch (e) {
            // Coupon not valid for this cart, ignore
        }
    }

    return bestCoupon;
};

module.exports = {
    getCouponByCode,
    validateCoupon,
    findBestAutoCoupon,
};
