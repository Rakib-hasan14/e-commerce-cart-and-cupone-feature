const cartService = require('./cart.service');

const createCart = async (req, res, next) => {
    try {
        const { userId } = req.body;
        const cart = await cartService.createCart(userId);
        res.status(201).json({
            status: 'success',
            data: { cart },
        });
    } catch (error) {
        next(error);
    }
};

const getCart = async (req, res, next) => {
    try {
        const { id } = req.params;
        const cart = await cartService.getCart(id);
        res.status(200).json({
            status: 'success',
            data: { cart },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createCart,
    getCart,
};
