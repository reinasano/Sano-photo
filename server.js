require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Define a schema for bookings
const bookingSchema = new mongoose.Schema({
    clientName: String,
    contactNumber: String,
    packageName: String,
    shootDate: String,
    shootTime: String,
    location: String
});

const Booking = mongoose.model('Booking', bookingSchema);

// API Endpoint to handle new booking submissions
app.post('/api/bookings', async (req, res) => {
    try {
        const newBooking = new Booking({
            clientName: req.body.clientName,
            contactNumber: req.body.contactNumber,
            packageName: req.body.packageName,
            shootDate: req.body.shootDate,
            shootTime: req.body.shootTime,
            location: req.body.location
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successful!' });
    } catch (error) {
        res.status(500).json({ message: 'Error saving booking', error: error.message });
    }
});

// API Endpoint to get all bookings (for the admin page)
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error: error.message });
    }
});

// API Endpoint to get a single booking by ID
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booking details', error: error.message });
    }
});

// API Endpoint to delete a booking by ID
app.delete('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting booking', error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});