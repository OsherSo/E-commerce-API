const { StatusCodes } = require('http-status-codes');

const { BadRequest, NotFound } = require('../errors');

const Order = require('../models/Order');
const Product = require('../models/Product');

const fakeStripeAPI = async ({ amount, currency }) => {
  const clientSecret = 'someRandomValue';
  return { clientSecret, amount };
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ count: orders.length, orders });
};

const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!order) throw new NotFound(`No product found`);

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });

  res.status(StatusCodes.OK).json({ count: orders.length, orders });
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
  const { paymentIntentId } = req.body;

  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!order) throw new NotFound(`No product found`);

  order.paymentId = paymentIntentId;
  order.status = 'paid';

  await order.save();

  res.status(StatusCodes.OK).json({ msg: order });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
