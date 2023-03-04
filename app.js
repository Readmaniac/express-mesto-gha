const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const routeUsers = require('./routes/users');
const routeCards = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://0.0.0.0:27017/mestodb');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '64033719a5479947b8714308',
  };

  next();
});
app.use('/users', routeUsers);
app.use('/cards', routeCards);

app.use((req, res) => {
  res.status(404).send({ message: 'Страницы по запрошенному URL не существует' });
});

// Если всё работает, консоль покажет, какой порт приложение слушает
app.listen(PORT, ()=> {
  console.log('сервер запущен');
});
