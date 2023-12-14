const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes');

const User = require('../models/User');
const Token = require('../models/Token');

const { BadRequest, Unauthorized } = require('../errors');

const { sendVerificationEmail } = require('../utils/email');
const { attachCookiesToResponse, createTokenUser } = require('../utils/jwt');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) throw new BadRequest('Email already exists');

  const verificationToken = crypto.randomBytes(40).toString('hex');
  await User.create({ name, email, password, verificationToken });

  const origin = 'http://localhost:3000';
  await sendVerificationEmail({ name, email, verificationToken, origin });

  res.status(StatusCodes.CREATED).json({
    msg: 'Success! Please check your email to verify account',
  });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.verificationToken !== verificationToken)
    throw new Unauthorized('Verification Failed');

  user.verified = Date.now();
  user.isVerified = true;
  await user.save();

  res.status(StatusCodes.OK).json({ msg: 'Email Verified' });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new BadRequest('Please provide email and password');

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password)))
    throw new Unauthorized('Invalid Credentials');
  if (!user.isVerified) throw new Unauthorized('Please verify your email');

  const tokenUser = createTokenUser(user);

  let refreshToken = '';
  const existingToken = await Token.findOne({ user: user._id });
  if (existingToken) {
    if (!existingToken.isValid) throw new Unauthorized('Invalid Credentials');
    refreshToken = existingToken.refreshToken;
  } else {
    refreshToken = crypto.randomBytes(40).toString('hex');
    const userAgent = req.headers['user-agent'];
    const { ip } = req;
    await Token.create({
      refreshToken,
      ip,
      userAgent,
      user: user._id,
    });
  }

  attachCookiesToResponse({ res, tokenUser, refreshToken });

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
  verifyEmail,
  login,
  logout,
};
