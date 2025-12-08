const { Coupon, CouponRule } = require('src/modules/entities');

const createCoupon = async (req, res, next) => {
    try {
        const { rules, ...couponData } = req.body;
        const coupon = await Coupon.create(couponData);

        if (rules && rules.length > 0) {
            const ruleData = rules.map(r => ({ ...r, coupon_id: coupon.id }));
            await CouponRule.bulkCreate(ruleData);
        }

        const fullCoupon = await Coupon.findByPk(coupon.id, { include: ['rules'] });

        res.status(201).json({
            status: 'success',
            data: { coupon: fullCoupon },
        });
    } catch (error) {
        next(error);
    }
};

const getAllCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.findAll({ include: ['rules'] });
        res.status(200).json({
            status: 'success',
            data: { coupons },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
};
