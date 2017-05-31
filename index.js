const express = require('express');
const logger       = require('morgan');
const mustacheExpress = require('mustache-express');
const passport     = require('passport');
const session      = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// normal setup for express & mustache (if we want to go there)
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(logger('dev'));

// body-parser setup
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(flash());

const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user, done) => {
  console.log('----------------------------------------');
  console.log('in passport.serializeUser callback');
  console.log('user: ');
  console.log(user);

  done(null, user);
});

passport.deserializeUser((userObj, done) => {
  console.log('----------------------------------------');
  console.log('in passport.deserializeUser callback');
  console.log('userObj: ');
  console.log(userObj);

  User
    .findByEmail(userObj.email)
    .then((user) => done(null, user))
    .catch((err) => {
      console.log('ERROR:', err);
      return done(null, false);
    });
});

// see router.post('/', ...) in controllers/users
passport.use(
  'local-signup',
  new LocalStrategy(
    {
      // these are the names of the fields for email and password in
      // the login form we'll be serving (see the view)
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User
        .create(req.body)
        .then((user) => {
          return done(null, user);
        })
        .catch((err) => {
          console.log('ERROR:', err);
          return done(null, false);
        });
    })
);

passport.use(
  'local-login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    (req, email, password, done) => {
      User
        .findByEmail(email)
        .then((user) => {
          if (user) {
      // here we use bcrypt to figure out whether the user is logged in or not
            const isAuthed = bcrypt.compareSync(password, user.password_digest);

            if (isAuthed) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          } else {
            return done(null, false);
          }
        });
    })
);

// connect router
app.use(require('./router'));

app.listen(PORT, () => console.log('Server is listening on port', PORT));
