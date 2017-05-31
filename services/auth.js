const AuthService = {};

AuthService.restrict = (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/users/login');
  }
};

module.exports = AuthService;
