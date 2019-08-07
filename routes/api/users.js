// External imports
const express = require('express');
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

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
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get user gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        password,
        avatar
      });

      // Encrypt password with bcrypt
      const SALT_ROUNDS = 10;
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Return jsonwebtoken (when a user registers, he is immediately logged in)

      res.send('User registered');
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
