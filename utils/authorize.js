//this middleware usully is implemented with the name restrict or retrictTo
//and take the role as a parameter like below code:
//also you have to pass a closure to the middleware instead of just one role
//that is because sometimes you will have multiple users with different roles
//that has access to the same resources , in case of sending an array of roles
const AppError = require("./appError");
exports.authorize = (role) => {
  return (req, res, next) => {
    if (req.user.role === role) {
      next();
    } else {
      return next(
        new AppError("You don't have access to this route. Forbidden!", 403)
      );
    }
  };
};
