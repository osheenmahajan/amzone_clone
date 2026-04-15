const productService = require('../services/productService');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { search, category } = req.query;
      const products = await productService.getProducts({ search, category });
      res.json(products);
    } catch (error) {
      next(error); // Pass to central error handler
    }
  }

  async getProduct(req, res, next) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
