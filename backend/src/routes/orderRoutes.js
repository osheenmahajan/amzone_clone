const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// POST /api/orders
router.post('/', orderController.createOrder);

// GET /api/orders
router.get('/', orderController.getUserOrders);

// GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

module.exports = router;
