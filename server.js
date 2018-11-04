const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

//routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Config File
const db = require('./config/keys').mongoURI;
//Connect to db
mongoose
  .connect(db)
  .then(() => console.log(`mLab Connected!`))
  .catch(err => console.log(err));

//Passport middleware and config file
app.use(passport.initialize());
require('./config/passport')(passport);

//Using routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
