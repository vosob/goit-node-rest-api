import HttpError from "./HttpError.js";

const validateParams = (schema) => {
  const func = (req, _, next) => {
    const { error } = schema.validate(req.query);
    if (error) {
      next(HttpError(400, error.message));
    }
    next();
  };

  return func;
};

export default validateParams;
