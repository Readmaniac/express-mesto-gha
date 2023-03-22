const JWT_SECRET = 'JWT_SECRET';
const regExp = /^(https?:\/\/)(www\.)?([a-z1-9-]{2,}\.)+[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*/i;

module.exports = {
  JWT_SECRET,
  regExp,
};
