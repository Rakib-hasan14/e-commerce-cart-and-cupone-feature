const { DataTypes } = require('sequelize');
const { sequelize } = require('src/utils/database/database-setup');

const CartItem = sequelize.define('CartItem', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    cart_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false, // Snapshot price
    },
}, {
    timestamps: true,
    underscored: true,
    tableName: 'cart_items',
    indexes: [
        {
            fields: ['cart_id'],
        },
        {
            fields: ['product_id'],
        },
    ],
});

module.exports = CartItem;
