// Middleware to handle not found error
const notFound = async (req, resp, next) => {
  const error = new Error(`${req.originalUrl} not found`);
  resp.status(404);
  next(error);
};
// Middleware to handle errors
const errHandler = async (err, req, resp, next) => {
  const statuscode = resp.statusCode == 200 ? 500 : resp.statusCode;
  resp.status(statuscode);
  resp.send({
    message: err?.message,
    stack: err?.stack,
  });
};

export { notFound, errHandler };
