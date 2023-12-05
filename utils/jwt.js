const jwt = require('jsonwebtoken');

const { Forbidden } = require('../errors');

const createJWT = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });

const attachCookiesToResponse = (res, payload) => {
  const token = createJWT(payload);

  const oneDay = 1 * 24 * 60 * 60 * 1000;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const createTokenUser = (user) => {
  return { userId: user._id, name: user.name, role: user.role };
};

const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.role === 'admin') return;
  if (requestUser.userId === resourceUserId.toString()) return;
  throw new Forbidden('You dont have permission');
};

module.exports = {
  createJWT,
  attachCookiesToResponse,
  verifyToken,
  createTokenUser,
  checkPermissions,
};
