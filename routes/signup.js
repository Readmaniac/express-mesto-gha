const router = require('express').Router();
const { registerUser } = require('../controllers/users');

router.post('/', registerUser);

module.exports = router;
