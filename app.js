require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
const express = require('express');
const cookieParser = require('cookie-parser');

const connectDB = require('./db/connect');

const { authUser } = require('./middleware/auth');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authUser, usersRouter);

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
