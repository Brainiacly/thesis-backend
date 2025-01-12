require('dotenv').config();
const path = require('path');
const os = require('os');

const express = require('express');
const cors = require('cors');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);

// Health Check
app.get('/', (req, res) => res.send('API is running!'));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(
        require(path.join(os.homedir(), '.firebase-service-account.json'))
    ),
});

app.use(async (req, res, next) => {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (token) {
        try {
            req.user = await admin.auth().verifyIdToken(token);
        } catch (error) {
            console.error('Firebase Auth Error:', error);
            return res.status(401).json({ error: 'Unauthorized' });
        }
    }
    next();
});
