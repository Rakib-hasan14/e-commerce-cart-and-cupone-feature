const productService = require('src/modules/product/product.service');

const createProduct = async (req, res, next) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({
            status: 'success',
            data: { product },
        });
    } catch (error) {
        next(error);
    }
};

const getAllProducts = async (req, res, next) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json({
            status: 'success',
            data: { products },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProduct,
    getAllProducts,
};
