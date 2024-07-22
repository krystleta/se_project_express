const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  const statusCode = err.statusCode || 500; // Default to 500 if no statusCode is provided
  const message = statusCode === 500 ? 'An error occurred on the server.' : err.message;

  res.status(statusCode).send({ message });
};

module.exports = errorHandler;