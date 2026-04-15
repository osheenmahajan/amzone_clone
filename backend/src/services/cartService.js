const cartRepository = require('../repositories/cartRepository');
const productRepository = require('../repositories/productRepository');

class CartService {
  async getCart(userId) {
    const items = await cartRepository.getCartItems(userId);
    
    // Calculate subtotal
    const subtotal = items.reduce((acc, item) => {
      return acc + (parseFloat(item.price) * item.quantity);
    }, 0);

    return {
      items,
      subtotal: parseFloat(subtotal.toFixed(2))
    };
  }

  async addToCart(userId, productId, quantity = 1) {
    // Check if product exists first
    const product = await productRepository.findById(productId);
    if (!product) {
      const error = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }

    const existingItem = await cartRepository.findCartItem(userId, productId);
    
    if (existingItem) {
      // If it exists, accumulate the quantity
      const newQuantity = existingItem.quantity + quantity;
      await cartRepository.updateItemQuantity(userId, productId, newQuantity);
    } else {
      // Add a fresh item to cart
      await cartRepository.addItem(userId, productId, quantity);
    }

    // Return the updated cart state
    return await this.getCart(userId);
  }

  async updateQuantity(userId, productId, quantity) {
    // Treat zero or negative quantity as removal strategy
    if (quantity <= 0) {
      await cartRepository.removeItem(userId, productId);
    } else {
      const existingItem = await cartRepository.findCartItem(userId, productId);
      if (!existingItem) {
        const error = new Error('Item not found in cart');
        error.statusCode = 404;
        throw error;
      }
      await cartRepository.updateItemQuantity(userId, productId, quantity);
    }
    
    return await this.getCart(userId);
  }

  async removeFromCart(userId, productId) {
    await cartRepository.removeItem(userId, productId);
    return { message: 'Item removed from cart successfully' };
  }
}

module.exports = new CartService();
