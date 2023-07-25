module.exports = class AuthorizeError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
