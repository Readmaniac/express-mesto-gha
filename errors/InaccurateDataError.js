module.exports = class InaccurateDataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
};

// ERROR_BAD_REQUEST
