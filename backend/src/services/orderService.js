const orderRepository = require('../repositories/orderRepository');
const cartRepository = require('../repositories/cartRepository');

class OrderService {
  async placeOrder(userId, shippingAddress) {
    // 1. Get all items mapping to user's cart
    const cartItems = await cartRepository.getCartItems(userId);
    
    if (cartItems.length === 0) {
      const error = new Error('Cannot place an order with an empty cart');
      error.statusCode = 400;
      throw error;
    }

    // 2. Calculate the total robustly
    const totalAmount = cartItems.reduce((acc, item) => {
      return acc + (parseFloat(item.price) * item.quantity);
    }, 0);

    // 3. Initiate a database transaction to ensure atomicity
    const orderId = await orderRepository.runTransaction(async (connection) => {
      
      // Create parent order
      const newOrderId = await orderRepository.createOrder(
        connection, 
        userId, 
        totalAmount, 
        shippingAddress
      );
      
      // Save all cart items as distinct order_items
      for (const item of cartItems) {
        await orderRepository.createOrderItem(
          connection, 
          newOrderId, 
          item.product_id, 
          item.quantity, 

          parseFloat(item.price)
        );
      }
      
      // Clear current user items in cart to finish order
      await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

      return newOrderId;
    });

    let previewUrl = null;
    try {
      const authRepository = require('../repositories/authRepository');
      const emailService = require('./emailService');
      const user = await authRepository.getUserById(userId);
      if (user && user.email) {
        previewUrl = await emailService.sendOrderConfirmationEmail(user.email, orderId, totalAmount, shippingAddress);
      }
    } catch (err) {
      console.error('Failed to dispatch notification:', err);
    }

    return { 
      order_id: orderId, 
      message: "Order placed successfully",
      email_preview_url: previewUrl
    };
  }

  async getOrder(userId, orderId) {
    const order = await orderRepository.getOrderById(orderId, userId);
    
    if (!order) {
      const error = new Error('Order not found');
      error.statusCode = 404;
      throw error;
    }

    const items = await orderRepository.getOrderItems(orderId);

    return {
      order_id: order.id,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: parseFloat(item.price)
      })),
      total_amount: parseFloat(order.total_amount),
      status: "Confirmed" // Included as static attribute as requested by api contract
    };
  }

  async getUserOrders(userId) {
    const orders = await orderRepository.getUserOrders(userId);
    
    // Fetch items for each order
    const fullOrders = await Promise.all(orders.map(async (order) => {
      const items = await orderRepository.getOrderItems(order.id);

      return {
        order_id: order.id,
        created_at: order.created_at,
        total_amount: parseFloat(order.total_amount),
        shipping_address: order.shipping_address,
        items: items.map(item => ({
          product: item.product,
          quantity: item.quantity,
          img: item.image_url || null,
          price: parseFloat(item.price)
        }))
      };
    }));
    
    return fullOrders;
  }
}

module.exports = new OrderService();
