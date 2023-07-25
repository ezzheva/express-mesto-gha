module.exports = class CurrentError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
