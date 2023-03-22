module.exports = class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
// ERROR_NOT_FOUND
