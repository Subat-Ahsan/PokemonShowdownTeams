const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const jwt = require('jsonwebtoken')

const { verify_jwt } = require('./authHelper');


router.post('/createUser', async (req, res) => {
  console.log(req)
  try {
    const { username, password } = req.body;

    if (!username  || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully.', userId: newUser._id });
  } catch (err) {
    if (err.code === 11000) {
      res.status(409).json({ error: 'Username or email already exists.' });
    } else {
      
      res.status(500).json({ error: 'Something went wrong.' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username  || !password) {
      return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid Password' });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '120h' }
    );
    return res.status(200).json({ token , userID:user._id, username: user.username });
  } catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
});



router.get('/test', verify_jwt, async (req, res) => {
    return res.status(200).json({name: req.user.username});
})

module.exports = router;