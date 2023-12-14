const jwt = require('jsonwebtoken');

const { Forbidden } = require('../errors');

const createJWT = ({ payload }) => jwt.sign(payload, process.env.JWT_SECRET);

const attachCookiesToResponse = ({ res, tokenUser, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { tokenUser } });
  const refreshTokenJWT = createJWT({ payload: { tokenUser, refreshToken } });

  const oneDay = 1 * 24 * 60 * 60 * 1000;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

const createTokenUser = ({ _id, name, role }) => ({ userId: _id, name, role });

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
