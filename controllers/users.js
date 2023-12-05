const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const { NotFound, BadRequest, Unauthorized } = require('../errors');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({
    count: users.length,
    users,
  });
};

const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select('-password');
  if (!user) throw new NotFound('No user found');

  res.status(StatusCodes.OK).json({
    user,
  });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUser = async (req, res) => {
  res.send('updateUser');
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new BadRequest('Please provide both values');

  const user = await User.findOne({ _id: req.user.userId });
  if (!(await user.comparePassword(oldPassword)))
    throw new Unauthorized('Invalid Credentials');

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};