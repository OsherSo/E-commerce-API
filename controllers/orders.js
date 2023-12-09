const { StatusCodes } = require('http-status-codes');

const { BadRequest, NotFound } = require('../errors');

const Order = require('../models/Order');
const Product = require('../models/Product');

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = 'someRandomValue';
  return { clientSecret, amount };
};

const getAllOrders = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'getAllOrders' });
};

const getSingleOrder = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'getSingleOrder' });
};

const getCurrentUserOrders = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'getCurrentUserOrders' });
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  if (!cartItems || cartItems.length < 1 || !tax || !shippingFee)
    throw new BadRequest('Please provide all values');

  const orderItems = [];
  let subtotal = 0;
  const promises = cartItems.map(async (item) => {
    const { product: productId, amount } = item;

    const product = await Product.findOne({ _id: productId });
    if (!product) throw new NotFound(`No product with id: ${productId}`);

    const { name, price, image } = product;
    const singleOrderItem = { name, image, price, amount, product: productId };

    orderItems.push(singleOrderItem);
    subtotal += amount * price;
  });
  await Promise.all(promises);

  const total = subtotal + shippingFee + tax;
  const paymentIntent = await fakeStripeAPI({
    amount: total,
    currency: 'usd',
  });

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    clientSecret: paymentIntent.clientSecret,
    user: req.user.userId,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};

const updateOrder = async (req, res) => {
  res.status(StatusCodes.OK).json({ msg: 'updateOrder' });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
