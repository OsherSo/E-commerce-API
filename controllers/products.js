const path = require('path');
const { StatusCodes } = require('http-status-codes');

const Review = require('../models/Review');
const Product = require('../models/Product');

const { NotFound, BadRequest } = require('../errors');

const getAllProducts = async (req, res) => {
  const products = await Product.find({});

  res.status(StatusCodes.OK).json({ count: products.length, products });
};

const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) throw new NotFound('Product not found');

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
  if (!product) throw new NotFound('Product not found');

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!product) throw new NotFound('Product not found');

  await Review.deleteMany({ product: product._id });

  res.status(StatusCodes.OK).json({ product: null });
};

const uploadImage = async (req, res) => {
  if (!req.files) throw new BadRequest('No File Uploaded');

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image'))
    throw new BadRequest('Please Upload Image');

  const maxSize = 1024 * 1024;
  if (productImage.size > maxSize)
    throw new BadRequest('Please upload image smaller 1KB');

  const name = productImage.name;
  const imagePath = path.join(__dirname, '../public/uploads/' + `${name}`);
  await productImage.mv(imagePath);

  res.status(StatusCodes.OK).json({
    image: `/uploads/${name}`,
  });
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
