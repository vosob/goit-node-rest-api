export const DBerror = (error, data, next) => {
  error.status = 400;
  next();
};
