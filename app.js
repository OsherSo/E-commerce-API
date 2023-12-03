require('dotenv').config();
require('express-async-errors');
const morgan = require('morgan');
const express = require('express');

const connectDB = require('./db/connect');

const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(morgan('tiny'));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Home Page');
});

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
