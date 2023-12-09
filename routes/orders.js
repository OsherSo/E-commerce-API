const express = require('express');

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../controllers/orders');

const { authUser, authPermissions } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(authUser, authPermissions('admin'), getAllOrders)
  .post(authUser, createOrder);

router.route('/showAllMyOrders').get(authUser, getCurrentUserOrders);

router.route('/:id').get(authUser, getSingleOrder).patch(authUser, updateOrder);

module.exports = router;
