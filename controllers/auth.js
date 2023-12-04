const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const { createJWT, verifyToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  const tokenUser = { userId: user._id, name: user.name, role: user.role };
  const token = createJWT(tokenUser);

  res.status(StatusCodes.CREATED).json({
    tokenUser,
    token,
  });
};

const login = async (req, res) => {
  res.send('login');
};

const logout = async (req, res) => {
  res.send('logout');
};

module.exports = {
  register,
  login,
  logout,
};
