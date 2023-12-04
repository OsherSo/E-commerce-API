const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const { BadRequest, Unauthorized } = require('../errors');
const { attachCookiesToResponse } = require('../utils/jwt');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequest('Please provide email and password');

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    throw new Unauthorized('Invalid Credentials');

  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  attachCookiesToResponse(res, tokenUser);

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const logout = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};

module.exports = {
  register,
  login,
  logout,
};
