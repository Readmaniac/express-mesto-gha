const router = require('express').Router();
const {
  registerUser,
  getUsersInfo,
  getUserInfo,
  setUserInfo,
  setUserAvatar,
  getCurrentUserInfo,
} = require('../controllers/users');

router.post('/', registerUser);
router.get('/', getUsersInfo);
router.get('/:id', getUserInfo);
router.get('/me', getCurrentUserInfo);
router.patch('/me', setUserInfo);
router.patch('/me/avatar', setUserAvatar);

module.exports = router;
