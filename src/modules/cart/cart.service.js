const Cart = require('./cart.entity');
const { AppError } = require('src/utils/AppError');

const createCart = async (userId) => {
    return await Cart.create({ userId });
};

const getCart = async (cartId) => {
    const cart = await Cart.findByPk(cartId);
    if (!cart) {
        throw new AppError('Cart not found', 404);
    }
    return cart;
};

module.exports = {
    createCart,
    getCart,
};
