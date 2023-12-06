const { StatusCodes } = require('http-status-codes');

const getAllReviews = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'getAllReviews' });
};

const getSingleReview = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'getSingleReview' });
};

const createReview = async (req, res) => {
  res.status(StatusCodes.CREATED).json({ msg: 'createReview' });
};

const updateReview = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'updateReview' });
};

const deleteReview = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'deleteReview' });
};

module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  updateReview,
  deleteReview,
};
