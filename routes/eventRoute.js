const express = require('express');
const multer = require('multer');
const {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Define routes
router.get('/events', getEvents);
router.post('/events', upload.array('image', 5), createEvent);
router.put('/events/:id', upload.array('image', 5), updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;
