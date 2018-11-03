const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const password = require('passport');

//Load Input Validation
const validateRegistserInput = require('../../validator/register');
const validateLoginInput = require('../../validator/login');

//Load Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'User tests!!'
  })
);

// @route   GET api/users/register
// @desc    Register new User
// @access  Public
router.post('/register', (req, res) => {
  //Pull out error from Register validation
  const { errors, isValid } = validateRegistserInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const profileimg = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        profileimg,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          //Save the user to database
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login User or retuning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  //Pull out error from Login validation
  const { errors, isValid } = validateLoginInput(req.body);

  //Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({
    email
  }).then(user => {
    //Check for user
    if (!user) {
      errors.email = 'User not found!';
      return res.status(404).json({
        errors
      });
    }

    //Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //User Matched now create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          profileimg: user.profileimg
        };
        //Sign the Token
        jwt.sign(
          payload,
          keys.secret,
          {
            expiresIn: 3600
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer' + token
            });
          }
        );
      } else {
        errors.password = 'Password not correct!';
        return res.status(404).json({
          errors
        });
      }
    });
  });
});

// @route   GET api/users/current
// @desc    Return current logged user
// @access  Private
router.get(
  '/current',
  password.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
