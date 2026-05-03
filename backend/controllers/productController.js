const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const category = req.query.category;
        const filter = category ? { category } : {};
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        console.error("error fetching products:", error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error("error fetching product:", error);
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
};
