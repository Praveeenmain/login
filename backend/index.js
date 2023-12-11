const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const EmployeeModel = require("./models/employee");
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

// Use environment variable for MongoDB URI
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017/employee";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.post('/signup', async (req, res) => {
    try {
        const employee = await EmployeeModel.create(req.body);
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await EmployeeModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }
        
        // Generate JWT token upon successful authentication
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '1h' }); // Use environment variable for JWT secret key
        console.log('Generated JWT Token:', token);
        return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
});

const PORT = process.env.PORT || 3002; // Use environment variable for port or default to 3002
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
