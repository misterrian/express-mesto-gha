const {
  PORT = 3000,
  MONGODB = 'mongodb://localhost:27017/mestodb',
} = process.env;

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errors } = require('./middlewares/errors');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const InvalidRoute = require('./errors/invalid-route-error');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('*', () => {
  throw new InvalidRoute();
});

app.use(errors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
