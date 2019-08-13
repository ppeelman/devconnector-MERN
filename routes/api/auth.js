// External imports
const express = require('express');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');

// Internal imports
const User = require('../../models/User');

const router = express.Router();

// @route    GET api/auth
// @desc     Test route
// @access   Public
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error!');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    // req.body : Contains key-value pairs of data submitted in the request body.
    // By default, it is undefined, and is populated when you use body-parsing middleware such as express.json() or express.urlencoded().
    //console.log(req.body);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // 422 Unprocessable entity error - https://httpstatuses.com/422
      res.status(422).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // SEE IF THE USER DOESN'T EXIST
      // findOne() is a mongoose helper function to perform a CRUD operation
      // https://mongoosejs.com/docs/queries.html
      let user = await User.findOne({ email });

      if (!user) {
        // Include a return statement so that request-response cycle stops at this point
        // Message: invalid credentials.
        // If instead you say 'User does not exist', people can find out what users have an account by entering different email addresses.
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials' }] });
      }

      // GENERTE JSON WEB TOKEN
      const payload = {
        user: {
          id: user.id // In MongoDB, its '_id' instead of 'id'. Mongoose, however, allows you to use 'id' without underscore
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 }, // Expiration time: optional
        (err, token) => {
          if (err) throw err;
          res.json({ token: token }); // return JSON web token (when a user registers, he is immediately logged in)
        }
      );
      // JSON web token payload created:
      /* {
        "user": {
          "id": "5d4bd5d023e4f743a0644460"
        },
        "iat": 1565251024,
        "exp": 1565611024
      } */
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
