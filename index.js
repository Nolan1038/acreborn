const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let playerData = {}; // In-memory store (replace with real DB later)

// Get player stats
app.get('/api/player/:id', (req, res) => {
  const id = req.params.id;
  res.json(playerData[id] || { message: 'No data found' });
});

// Save/update player stats
app.post('/api/player/:id', (req, res) => {
  const id = req.params.id;
  playerData[id] = req.body;
  res.json({ message: 'Player data saved', data: playerData[id] });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend listening on port ${port}`);
});
