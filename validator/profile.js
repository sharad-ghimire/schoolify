const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  //if values is null or undefined its gonna set to empty string
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.familyName = !isEmpty(data.familyName) ? data.familyName : '';
  data.sex = !isEmpty(data.sex) ? data.sex : '';
  data.mobileNumber = !isEmpty(data.mobileNumber) ? data.mobileNumber : '';
  data.studyType = !isEmpty(data.studyType) ? data.studyType : '';
  data.zone = !isEmpty(data.zone) ? data.zone : '';
  data.district = !isEmpty(data.district) ? data.district : '';
  data.university = !isEmpty(data.university) ? data.university : '';
  data.institutionName = !isEmpty(data.institutionName)
    ? data.institutionName
    : '';
  data.course = !isEmpty(data.course) ? data.course : '';
  data.yearStarted = !isEmpty(data.yearStarted) ? data.yearStarted : '';
  data.lastYearOfStudy = !isEmpty(data.lastYearOfStudy)
    ? data.lastYearOfStudy
    : '';
  data.course = !isEmpty(data.course) ? data.course : '';

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to between 2 and 40 character ';
  }
  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required! ';
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'First Name is required! ';
  }
  if (Validator.isEmpty(data.familyName)) {
    errors.familyName = 'Family Name is required! ';
  }
  if (Validator.isEmpty(data.sex)) {
    errors.sex = 'Sex is required! ';
  }
  if (Validator.isEmpty(data.studyType)) {
    errors.studyType = 'Study Type is required! ';
  }
  if (Validator.isEmpty(data.institutionName)) {
    errors.institutionName = 'Institution Name Name is required! ';
  }
  if (Validator.isEmpty(data.course)) {
    errors.course = 'Course Name Name is required! ';
  }

  //Social
  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid Facebok URL';
    }
  }
  if (!isEmpty(data.instagram)) {
    if (!Validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid Instagram URL';
    }
  }
  if (!isEmpty(data.twitter)) {
    if (!Validator.isURL(data.twitter)) {
      errors.twitter = 'Not a Twitter valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
