const { DataTypes } = require('sequelize');
const { sequelize } = require('src/utils/database/database-setup');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('active', 'completed', 'abandoned'),
        defaultValue: 'active',
    },
}, {
    timestamps: true,
});

module.exports = Cart;
