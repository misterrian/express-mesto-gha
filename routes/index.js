const router = require('express').Router();

const { loginValidator, createUserValidator } = require('../middlewares/validators');
const { login, createUser, signout } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const InvalidRoute = require('../errors/invalid-route-error');

router.post('/signin', loginValidator, login);
router.post('/signup', createUserValidator, createUser);

router.use(auth);

router.get('/signout', signout);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new InvalidRoute());
});

module.exports = router;
