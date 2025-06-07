const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json());

let users = {};      // userId -> { password }
let playerData = {}; // userId -> { stats }

app.post('/api/register', (req, res) => {
    const { userId, password } = req.body;
    if (users[userId]) return res.status(400).json({ message: 'User already exists' });
    users[userId] = { password };
    playerData[userId] = { xp: 0, coins: 0 };
    res.json({ message: 'Registered!' });
});

app.post('/api/login', (req, res) => {
    const { userId, password } = req.body;
    if (!users[userId] || users[userId].password !== password)
        return res.status(401).json({ message: 'Invalid credentials' });
    res.json({ message: 'Login successful' });
});

app.get('/api/player/:id', (req, res) => {
    const id = req.params.id;
    if (!playerData[id]) return res.status(404).json({ message: 'No data found' });
    res.json(playerData[id]);
});

app.post('/api/player/:id', (req, res) => {
    const id = req.params.id;
    playerData[id] = req.body;
    res.json({ message: 'Player data saved' });
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server running');
});
