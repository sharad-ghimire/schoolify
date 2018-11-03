const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  firstName: {
    type: String,
    required: true
  },
  familyName: {
    type: String,
    required: true
  },
  sex: {
    type: String,
    required: true
  },
  mobileNumber: {
    type: String
  },
  studyType: {
    //Collage, School, Univeristy
    type: String,
    required: true
  },
  zone: {
    //Rapti
    type: String
  },
  district: {
    //Dang
    type: String
  },
  city: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  institutionName: {
    type: String,
    required: true
  },
  course: {
    type: String,
    required: true
  },
  yearStarted: {
    type: String,
    required: true
  },
  lastYearOfStudy: {
    type: String
  },
  social: {
    facebook: {
      type: String
    },
    instagram: {
      type: String
    },
    twitter: {
      type: String
    }
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
