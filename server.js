// External imports
const express = require('express');

// Internal imports
const connectDB = require('./config/db');

const app = express();

// Connect to database
connectDB();

// Init middleware
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('API running');
});

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
