//this middleware usully is implemented with the name restrict or retrictTo
//and take the role as a parameter like below code:
//also you have to pass a closure to the middleware instead of just one role
//that is because sometimes you will have multiple users with different roles
//that has access to the same resources , in case of sending an array of roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        status: "fail",
        message: "You don't have access to this route. Forbidden!",
      });
    }
  };
};
