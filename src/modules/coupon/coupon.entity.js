const { DataTypes } = require('sequelize');
const { sequelize } = require('src/utils/database/database-setup');

const Coupon = sequelize.define('Coupon', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    type: {
        type: DataTypes.ENUM('general', 'auto_applied'),
        defaultValue: 'general',
    },
    discount_type: {
        type: DataTypes.ENUM('fixed', 'percentage'),
        allowNull: false,
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    max_discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Maximum discount amount for percentage based coupons',
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    expiry_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    usage_limit: {
        type: DataTypes.INTEGER,
        defaultValue: null, // Null means unlimited
    },
    usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    user_usage_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {
    timestamps: true,
    underscored: true,
    tableName: 'coupons',
    indexes: [
        {
            unique: true,
            fields: ['code'],
        },
        {
            fields: ['type', 'start_date', 'expiry_date'],
        },
    ],
});

module.exports = Coupon;
