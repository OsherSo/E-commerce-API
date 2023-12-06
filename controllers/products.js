const { StatusCodes } = require('http-status-codes');

const Product = require('../models/Product');
const { NotFound } = require('../errors');

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) throw new NotFound('No product found');

  res.status(StatusCodes.OK).json({ product });
};

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);

  res.status(StatusCodes.CREATED).json({ product });
};

const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!product) throw new NotFound('No product found');

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  await Product.findOneAndDelete({ _id: req.params.id, user: req.user.userId });

  res.status(StatusCodes.OK).json({ product: null });
};

const uploadImage = async (req, res) => {
  res.send('uploadImage');
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
