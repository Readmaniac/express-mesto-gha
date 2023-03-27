const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const NotFoundError = require('./errors/NotFoundError');
const errorHandler = require('./middlewares/error-handler');
const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const routeSignUp = require('./routes/signup');
const routeSignIn = require('./routes/signin');
const auth = require('./middlewares/auth');

const URL = 'mongodb://0.0.0.0:27017/mestodb';

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);
mongoose.connect(URL);

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routeSignUp);
app.use('/', routeSignIn);
// app.use(auth);
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res, next) => next(new NotFoundError('Страницы по запрошенному URL не существует')));
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('сервер работает');
});
