const { isUUID } = require('validator');
const cartService = require('src/modules/cart/cart.service');

const getCart = async (req, res, next) => {
    try {
        const userId = req.query.userId || req.body.userId;
        if (!userId) return res.status(400).json({ message: 'userId is required' });

        const cart = await cartService.getCart(userId);
        res.status(200).json({
            status: 'success',
            data: cart || { message: 'Cart is empty' },
        });
    } catch (error) {
        next(error);
    }
};

const addItem = async (req, res, next) => {
    try {
        const { userId, productId, quantity } = req.body;
        if (!isUUID(userId) || !isUUID(productId)) return res.status(400).json({ message: 'Invalid userId or productId' });
        const cart = await cartService.addItem(userId, productId, quantity);
        res.status(200).json({
            status: 'success',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const updateItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId, quantity } = req.body;
        if (!isUUID(userId)) return res.status(400).json({ message: 'Invalid userId' });
        const cart = await cartService.updateItem(userId, id, quantity);
        res.status(200).json({
            status: 'success',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const removeItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        if (!isUUID(userId)) return res.status(400).json({ message: 'Invalid userId' });
        const cart = await cartService.removeItem(userId, id);
        res.status(200).json({
            status: 'success',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const applyCoupon = async (req, res, next) => {
    try {
        const { userId, code } = req.body;
        const cart = await cartService.applyCoupon(userId, code);
        res.status(200).json({
            status: 'success',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const removeCoupon = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!isUUID(userId)) return res.status(400).json({ message: 'Invalid userId' });
        const cart = await cartService.removeCoupon(userId);
        res.status(200).json({
            status: 'success',
            data: cart,
        });
    } catch (error) {
        next(error);
    }
};

const checkout = async (req, res, next) => {
    try {
        const { userId } = req.body;
        if (!isUUID(userId)) return res.status(400).json({ message: 'Invalid userId' });
        const result = await cartService.checkout(userId);
        res.status(200).json({
            status: 'success',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCart,
    addItem,
    updateItem,
    removeItem,
    applyCoupon,
    removeCoupon,
    checkout,
};
