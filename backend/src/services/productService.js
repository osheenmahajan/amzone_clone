const productRepository = require('../repositories/productRepository');

class ProductService {
  async getProducts(filters) {
    return await productRepository.findAll(filters);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    return product;
  }
}

module.exports = new ProductService();
