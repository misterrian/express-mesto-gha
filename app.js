const {
  PORT = 3000,
  MONGODB = 'mongodb://localhost:27017/mestodb',
} = process.env;

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { sendMessage } = require('./utils/utils');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6301f71e2b9163fa68b8b74f',
  };
  next();
});

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.get('*', (req, res) => {
  sendMessage(res, 404, 'Bad path');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
