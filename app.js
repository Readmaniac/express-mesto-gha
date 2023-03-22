const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');
const routeSignUp = require('./routes/signup');
const routeSignIn = require('./routes/signin');
// const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const { ERROR_NOT_FOUND } = require('./errors/errors');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routeSignUp);
app.use('/', routeSignIn);
// app.use(auth);
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res) => {
  res.status(ERROR_NOT_FOUND).send({ message: 'Страницы по запрошенному URL не существует' });
});

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT);
