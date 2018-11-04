const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport'); //use this for protected routes

//Load Models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

//Load Input Validation
const validateProfileInput = require('../../validator/profile');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) =>
  res.json({
    msg: 'Profile tests!!'
  })
);

// @route   GET api/profile
// @desc    Get current user Profile
// @access  Protected
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = {};
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'No profile for this user!';
          res.status(400).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    Create or Edit users profile
// @access  Protected
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //Check that validation
    if (!isValid) {
      //Return errors
      return res.status(400).json(errors);
    }

    //Get fields
    const profileField = {};
    profileField.user = req.user.id;
    profileField.email = req.user.email;
    if (req.body.handle) profileField.handle = req.body.handle;
    if (req.body.firstName) profileField.firstName = req.body.firstName;
    if (req.body.familyName) profileField.familyName = req.body.familyName;
    if (req.body.sex) profileField.sex = req.body.sex;
    if (req.body.mobileNumber)
      profileField.mobileNumber = req.body.mobileNumber;
    if (req.body.studyType) profileField.studyType = req.body.studyType;
    if (req.body.zone) profileField.zone = req.body.zone;
    if (req.body.district) profileField.district = req.body.district;
    if (req.body.university) profileField.university = req.body.university;
    if (req.body.institutionName)
      profileField.institutionName = req.body.institutionName;
    if (req.body.course) profileField.course = req.body.course;
    if (req.body.yearStarted) profileField.yearStarted = req.body.yearStarted;
    if (req.body.lastYearOfStudy)
      profileField.lastYearOfStudy = req.body.lastYearOfStudy;
    if (req.body.course) profileField.course = req.body.course;

    //Social
    profileField.social = {};
    if (req.body.facebook) profileField.social.facebook = req.body.facebook;
    if (req.body.instagram) profileField.social.instagram = req.body.instagram;
    if (req.body.twitter) profileField.social.twitter = req.body.twitter;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //Update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileField },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create
        //Check to see if handle exists
        Profile.findOne({ handle: profileField.handle }).then(profile => {
          if (profile) {
            errors.handle = 'That handle exists';
            res.status(400).json(errors);
          } else {
            //Save Profile
            new Profile(profileField).save().then(profile => res.json(profile));
          }
        });
      }
    });
  }
);

module.exports = router;
