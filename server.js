const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mysterybox');

const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  password: String,
  wallet: { type: Number, default: 5000 },
  winnings: { type: Number, default: 0 },
  boxes: { type: Number, default: 0 }
}));

// ...बाकी code...


// ...existing code...

// Register API
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
  const exists = await User.findOne({ username });
  if (exists) return res.status(400).json({ error: 'User exists' });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ username, password: hashedPassword });
  res.json({ success: true, user: { username: user.username } });
});

// Login API
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ success: true, user: { username: user.username } });
});

// Start server
app.listen(5000, () => console.log('Backend running on http://localhost:5000'));
