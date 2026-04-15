const cartService = require('../services/cartService');

class CartController {
  async getCart(req, res, next) {
    try {
      const cart = await cartService.getCart(req.user.userId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  async addToCart(req, res, next) {
    try {
      const { product_id, quantity } = req.body;
      if (!product_id) {
        return res.status(400).json({ error: 'product_id is required' });
      }
      const cart = await cartService.addToCart(req.user.userId, product_id, quantity || 1);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req, res, next) {
    try {
      const { product_id } = req.params;
      const { quantity } = req.body;
      
      if (quantity === undefined) {
        return res.status(400).json({ error: 'quantity is required' });
      }

      const cart = await cartService.updateQuantity(req.user.userId, product_id, quantity);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }

  async removeCartItem(req, res, next) {
    try {
      const { product_id } = req.params;
      const result = await cartService.removeFromCart(req.user.userId, product_id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CartController();
