const orderService = require('../services/orderService');

class OrderController {
  async createOrder(req, res, next) {
    try {
      const { shipping_address, payment_mode } = req.body;

      if (!shipping_address) {
        return res.status(400).json({ error: 'shipping_address is required' });
      }

      const result = await orderService.placeOrder(req.user.userId, shipping_address);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await orderService.getOrder(req.user.userId, id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const orders = await orderService.getUserOrders(req.user.userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();
