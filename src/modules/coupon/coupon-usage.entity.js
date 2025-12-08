const { DataTypes } = require('sequelize');
const { sequelize } = require('src/utils/database/database-setup');

const CouponUsage = sequelize.define('CouponUsage', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    coupon_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: true, // Nullable if tracking before order completion
    },
}, {
    timestamps: true,
    underscored: true,
    tableName: 'coupon_usages',
    indexes: [
        {
            fields: ['coupon_id', 'user_id'],
        },
    ],
});

module.exports = CouponUsage;
