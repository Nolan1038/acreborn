const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'your-super-secret-key'; // Replace with env var in production

let users = {};      // { username: { password } }
let playerData = {}; // { username: { xp, money, ... } }

// Register new user
app.post('/api/register', (req, res) => {
    const { userId, password } = req.body;
    if (users[userId]) return res.status(400).json({ message: 'User already exists' });

    users[userId] = { password };
    playerData[userId] = { money: 100, unlockedItems: [] };
    res.json({ message: 'User registered' });
});

// Login and return JWT
app.post('/api/login', (req, res) => {
    const { userId, password } = req.body;
    const user = users[userId];
    if (!user || user.password !== password)
        return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId }, SECRET, { expiresIn: '6h' });
    res.json({ token });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const header = req.headers['authorization'];
    if (!header) return res.status(403).json({ message: 'No token' });

    const token = header.split(' ')[1];
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.userId = decoded.userId;
        next();
    });
}

// Get player data
app.get('/api/player', verifyToken, (req, res) => {
    const data = playerData[req.userId];
    if (!data) return res.status(404).json({ message: 'No data found' });
    res.json(data);
});

// Update player data
app.post('/api/player', verifyToken, (req, res) => {
    playerData[req.userId] = req.body;
    res.json({ message: 'Data saved' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
