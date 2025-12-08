const Product = require('src/modules/product/product.entity');

const createProduct = async (data) => {
    return await Product.create(data);
};

const getAllProducts = async () => {
    return await Product.findAll();
};

const getProductById = async (id) => {
    return await Product.findByPk(id);
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
};
