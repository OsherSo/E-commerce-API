const { Unauthorized } = require('../errors');
const { verifyToken } = require('../utils/jwt');

const authUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) throw new Unauthorized('Authentication Invalid');

  try {
    const { userId, name, role } = verifyToken(token);
    req.user = { userId, name, role };
    next();
  } catch (error) {
    throw new Unauthorized('Authentication Invalid');
  }
};

module.exports = {
  authUser,
};
