## MongoDB

MongoDB is a **NoSQL** database, not a relational database (like PostgreSQL, MySQL etc.)  
Instead of tables, columns... , we have the concept of '**documents**'
Syntax is close to JSON, so pairs really well with JavaScript

### Install MongoDB

- locally
- in the cloud (using Atlas) => **this project**

### Create a clustor

- Cloud Provider: **AWS**
- Cloud Region (should be free tier available): **Frankfurt (eu-central-1)**
- Cluster Tier (free tier): **M0 Sandbox (Shared RAM, 512 MB storage) - Encrypted**
- Cluster Name: **DevConnector**

### Create your first database user

_left-hand menu_ > SECURITY > Database Access

**Add new user** with the following privileges: "Read and write to any database"

### Whitelist your IP address

_left-hand menu_ > SECURITY > Network Access

For a real application, whitelist your **own IP address**

## Dependencies

- **express**: a server-side web framework for Node.js (https://expressjs.com/)
- **config**: create default parameters stored in configuration files (config/default.json); extend them for different deployment environments (development, QA, staging, production) (https://www.npmjs.com/package/config)
- **mongoose**: acts as an intermediate between MongoDB and a server-side language like Node.js (https://mongoosejs.com/docs/index.html)
- **express-validator**: Express middleware to validate request/response values (https://express-validator.github.io/docs/)
- **gravatar**: generate gravatar (globally recognized avatars linked to a user's email address) URLs in Node.js based on gravatar specs (https://www.npmjs.com/package/gravatar)
- **bcrypt**: encryption method used to encrypt passwords. It uses a variant of the Blowfish encryption algorithm's keying schedule, and introduces a work factor, which allows you to determine how expensive the hash function will be. (https://www.npmjs.com/package/bcrypt)
- **json-web-token**:

## Mongoose

### Defining your schema

```js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  title: String,
  author: String,
  email: {
      type: String,
      required: true,
      unique: true
  }
  body: String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs: Number
  }
});
```

Documentation: https://mongoosejs.com/docs/guide.html#definition

### Creating a model

To use our schema definition, we need to convert our blogSchema into a Model we can work with. To do so, we pass it into mongoose.model(modelName, schema):

```js
const Blog = mongoose.model('Blog', blogSchema);
```

### Creating an instance of the model

Instances of Models are **documents**. Documents have many of their own built-in instance methods. We may also define our own custom document instance methods too.

```js
const user = new User({
  name,
  email,
  password,
  avatar
});

user.password = encryptedPassword;
```

## Express-validator

### Validating the request body of a POST request (register a user)

```js
const { check, validationResult } = require('express-validator');

app.post('/user', [
  // username must be an email
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email').isEmail(),
  // password must be at least 5 chars long
  check('password', 'Your password should have a minimal length of 6').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  // 422 Unprocessable entity error - https://httpstatuses.com/422
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  ...
});
```

Documentation: https://express-validator.github.io/docs/

## Gravatar

Examples:

```js
ar gravatar = require('gravatar');

var url = gravatar.url('emerleite@gmail.com', {s: '200', r: 'pg', d: '404'});
//returns //www.gravatar.com/avatar/93e9084aa289b7f1f5e4ab6716a56c3b?s=200&r=pg&d=404

var unsecureUrl = gravatar.url('emerleite@gmail.com', {s: '100', r: 'x', d: 'retro'}, false);
//returns http://www.gravatar.com/avatar/93e9084aa289b7f1f5e4ab6716a56c3b?s=100&r=x&d=retro

var secureUrl = gravatar.url('emerleite@gmail.com', {s: '100', r: 'x', d: 'retro'}, true);
//returns https://s.gravatar.com/avatar/93e9084aa289b7f1f5e4ab6716a56c3b?s=100&r=x&d=retro

var httpUrl = gravatar.url('emerleite@gmail.com', {protocol: 'http', s: '100'});
//returns http://www.gravatar.com/avatar/93e9084aa289b7f1f5e4ab6716a56c3b?s=100

var httpsUrl = gravatar.url('emerleite@gmail.com', {protocol: 'https', s: '100'});
//returns https://s.gravatar.com/avatar/93e9084aa289b7f1f5e4ab6716a56c3b?s=100

var profile1 = gravatar.profile_url('emerleite@gmail.com', {protocol: 'https'});
//returns https://secure.gravatar.com/93e9084aa289b7f1f5e4ab6716a56c3b.json

var profile2 = gravatar.profile_url('emerleite@gmail.com', {protocol: 'http', format:'qr'});
//returns http://www.gravatar.com/93e9084aa289b7f1f5e4ab6716a56c3b.qr
```

Documentation: https://www.npmjs.com/package/gravatar

## bcrypt

```js
bcrypt.genSalt(saltRounds, function(err, salt) {
  bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
    // Store hash in your password DB.
  });
});
```

OR

```js
const SALT_ROUNDS = 10;
const salt = await bcrypt.genSalt(SALT_ROUNDS);
user.password = await bcrypt.hash(password, salt);

await user.save();
```

bcrypt.genSalt(saltRounds, function(err, salt) {
bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
// Store hash in your password DB.
});
});

Documentation:

- https://www.npmjs.com/package/bcrypt
- https://codahale.com/how-to-safely-store-a-password/
- https://en.wikipedia.org/wiki/Bcrypt

## JSON Web Token

What are JSON web tokens? https://jwt.io/
