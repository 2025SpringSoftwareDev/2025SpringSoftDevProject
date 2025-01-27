const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const indexRouter = require('./routes/index');
const userRoutes = require('./routes/user');

const app = express();
const PORT = 3000;

// idk what this does
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/restaurant', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

// Set the view engine to Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));


// Use the router
app.use('/', indexRouter);
app.use('/user', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});