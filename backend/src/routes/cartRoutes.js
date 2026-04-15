const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// GET /api/cart
router.get('/', cartController.getCart);

// POST /api/cart
router.post('/', cartController.addToCart);

// PUT /api/cart/:product_id
router.put('/:product_id', cartController.updateCartItem);

// DELETE /api/cart/:product_id
router.delete('/:product_id', cartController.removeCartItem);

module.exports = router;
