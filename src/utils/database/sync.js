require('module-alias/register');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { sequelize } = require('src/utils/database/database-setup');
const { Product, Cart, CartItem, Coupon, CouponRule, CouponUsage } = require('src/modules/entities');

const syncDatabase = async () => {
    try {
        // Force sync to recreate tables (WARNING: DATA LOSS)
        // For production, use migrations. For this demo, sync is fine.
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error synchronizing database:', error);
        process.exit(1);
    }
};

syncDatabase();
