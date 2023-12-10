require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const cors = require('cors');
const xss = require('xss-clean');
const helmet = require('helmet');
const rateLimiter = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./db/connect');

const { authUser } = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');
const reviewsRouter = require('./routes/reviews');
const productsRouter = require('./routes/products');

const app = express();

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
);

app.use(xss());
app.use(cors());
app.use(helmet());
app.use(mongoSanitize());

app.use(express.static('./public'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authUser, usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/products', productsRouter);
app.use('/api/v1/orders', ordersRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
