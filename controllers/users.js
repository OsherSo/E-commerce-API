const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const { NotFound } = require('../errors');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' });

  res.status(StatusCodes.OK).json({
    count: users.length,
    users,
  });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) throw new NotFound('No user found');

  res.status(StatusCodes.OK).json({
    user,
  });
};

const showCurrentUser = async (req, res) => {
  res.send('showCurrentUser');
};

const updateUser = async (req, res) => {
  res.send('updateUser');
};

const updateUserPassword = async (req, res) => {
  res.send('updateUserPassword');
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
