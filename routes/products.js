const express = require('express');

const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require('../controllers/products');

const { authUser, authPermissions } = require('../middleware/auth');

const router = express.Router();

router
  .route('/')
  .get(getAllProducts)
  .post(authUser, authPermissions('admin'), createProduct);

router
  .route('/uploadImage')
  .post(authUser, authPermissions('admin'), uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(authUser, authPermissions('admin'), updateProduct)
  .delete(authUser, authPermissions('admin'), deleteProduct);

module.exports = router;
