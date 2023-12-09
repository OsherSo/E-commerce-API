const { StatusCodes } = require('http-status-codes');

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
  res.status(StatusCodes.OK).json({ msg: 'createOrder' });
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
