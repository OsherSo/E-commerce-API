const { StatusCodes } = require('http-status-codes');

const { NotFound, BadRequest } = require('../errors');

const Review = require('../models/Review');
const Product = require('../models/Product');

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({}).populate({
    path: 'product',
    select: 'name company price',
  });

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id }).populate({
    path: 'product',
    select: 'name company price',
  });
  if (!review) throw new NotFound('No review found');

  res.status(StatusCodes.OK).json({ review });
};

const createReview = async (req, res) => {
  const { userId } = req.user;
  const { product: productId } = req.body;

  const isProductExists = await Product.findOne({ _id: productId });
  if (!isProductExists) throw new NotFound('No product found');

  const isReviewExists = await Review.findOne({
    user: userId,
    product: productId,
  });
  if (isReviewExists)
    throw new BadRequest('Already submitted review for this product');

  req.body.user = userId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;

  const review = await Review.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!review) throw new NotFound('No review found');

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req, res) => {
  await Review.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

  res.status(StatusCodes.OK).json({ review: null });
};

const getSingleProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id });

  res.status(StatusCodes.OK).json({ count: reviews.length, reviews });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
