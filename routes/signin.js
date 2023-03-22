const router = require('express').Router();
const { loginUser } = require('../controllers/users');

router.post('/signin', loginUser);

module.exports = router;
