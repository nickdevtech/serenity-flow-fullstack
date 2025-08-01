const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(cors());
app.use(express.json());

//db connection
mongoose.connect(process.env.MONGO_URI , {
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});