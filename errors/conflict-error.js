class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}
module.export = ConflictError;
