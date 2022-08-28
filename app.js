const {
  PORT = 3000,
  MONGODB = 'mongodb://localhost:27017/mestodb',
} = process.env;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

const {
  login,
  loginValidator,
  createUser,
  createUserValidator,
} = require('./controllers/users');

const { auth } = require('./middlewares/auth');
const { errorsHandler } = require('./middlewares/errors');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const InvalidRoute = require('./errors/invalid-route-error');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.post('/signin', loginValidator, login);
app.post('/signup', createUserValidator, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', () => {
  throw new InvalidRoute();
});

app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
