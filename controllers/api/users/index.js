const router = require('express').Router();
const bodyParser = require('body-parser');
const passport = require('passport');
const controller = require('./controller');
const User = require('../../../models/user');
const AuthService = require('../../../services/auth');

// router.put('/:id', controller.update);
// router.post('/', controller.create);
// router.get('/place/:id', controller.show);

router.get('/new', controller.new);
router.get('/logout', controller.logout);
router.get('/login', controller.signin);

router.get('/profile', AuthService.restrict, (req, res) => {
    User
      .findByEmail(req.user.email)
      .then((user) => {
    res.render('users/profile', { user: user });
    })
      .catch(err => console.log('ERROR:', err));
  }
);

router.get('/:id', controller.profile);
router.get('/:id/search', controller.index);
router.get('/:id/places', controller.show);
// router.get('/:id/lists', controller.lists);

router.post('/',
  bodyParser.urlencoded({extended: true}),
  passport.authenticate('local-signup',
    {
      failureRedirect: '/users/new',
      successRedirect: '/users/profile'
    }
  )
);

router.post('/login',
  bodyParser.urlencoded({extended: true}),
  passport.authenticate('local-login',
    {
      failureRedirect: '/users/login',
      successRedirect: '/users/profile'
    }
  )
);

// router.post('/:user_id/comments', controller.create);
// router.post('/:user_id/places/:place_id/comments', controller.comments);

module.exports = router;

