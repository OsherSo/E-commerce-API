const { Unauthorized, Forbidden } = require('../errors');
const { verifyToken } = require('../utils/jwt');

const authUser = (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) throw new Unauthorized('Authentication Invalid');

  try {
    const { userId, name, role } = verifyToken(token);
    req.user = { userId, name, role };
    next();
  } catch (error) {
    throw new Unauthorized('Authentication Invalid');
  }
};

const authPermissions =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new Forbidden('You dont have permissions');
    next();
  };

module.exports = {
  authUser,
  authPermissions,
};
