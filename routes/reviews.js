const express = require('express');

const {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

const { authUser } = require('../middleware/auth');

const router = express.Router();

router.route('/').get(getAllReviews).post(authUser, createReview);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authUser, updateReview)
  .delete(authUser, deleteReview);

module.exports = router;
