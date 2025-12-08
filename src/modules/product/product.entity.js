const { DataTypes } = require('sequelize');
const { sequelize } = require('src/utils/database/database-setup');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    timestamps: true,
    underscored: true, // Enforces snake_case for created_at, updated_at and foreign keys
    tableName: 'products',
    indexes: [
        {
            fields: ['name'],
        },
    ],
});

module.exports = Product;
