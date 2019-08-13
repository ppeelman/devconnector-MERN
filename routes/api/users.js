// External imports
const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// Internal imports
const User = require('../../models/User');

const router = express.Router();

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
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

    const { name, email, password } = req.body;

    try {
      // SEE IF A USER EXISTS
      // findOne() is a mongoose helper function to perform a CRUD operation
      // https://mongoosejs.com/docs/queries.html
      let user = await User.findOne({ email });

      if (user) {
        // Include a return statement so that request-response cycle stops at this point
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: '200', // s: size
        r: 'pg', // r: rating (pg: no nudes)
        d: 'mm' // d: default
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // Encrypt password with bcrypt
      const SALT_ROUNDS = 10; // Recommended by the documentation
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      console.log('User saved to database');

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
