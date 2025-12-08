const { DataTypes } = require('sequelize');
const { sequelize } = require('src/utils/database/database-setup');

const CouponRule = sequelize.define('CouponRule', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    coupon_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rule_type: {
        type: DataTypes.ENUM('min_cart_amount', 'min_cart_items', 'product_restriction', 'specific_user'),
        allowNull: false,
    },
    value: {
        type: DataTypes.JSONB, // Stores { amount: 100 } or { product_ids: [...] }
        allowNull: false,
    },
}, {
    timestamps: true,
    underscored: true,
    tableName: 'coupon_rules',
});

module.exports = CouponRule;
