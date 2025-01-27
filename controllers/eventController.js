const { ObjectId } = require('mongodb');
const dbConnect = require('../config/dbConnect');

//Get events by ID or type
const getEvents = async (req, res) => {
    const { id, type, limit = 5, page = 1 } = req.query;

    try {
        const db = await dbConnect();
        const collection = db.collection('events');

        if (id) {
            // Fetch a single event by ID
            const event = await collection.findOne({
                _id: new ObjectId(id)
            });
            if (event) {
                res.status(200).json(event);
            } else {
                res.status(404).json({ message: 'Event not found' });
            }
        }
        else if (type === 'latest') {
            const events = await collection
                .find({})
                .sort({ schedule: -1 })
                .skip((page - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .toArray();
            res.status(200).json(events);
        }
        else if (type) {
            const events = await collection
                .find({ type: { $regex: type, $options: 'i' } })
                .skip((page - 1) * parseInt(limit))
                .limit(parseInt(limit))
                .toArray();
            if (events.length > 0) {
                res.status(200).json(events);
            } else {
                res.status(404).json({ message: 'No events found for the given type' });
            }
        }
        else {
            res.status(400).json({ message: 'Invalid query parameters' });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Error fetching events', details: error.message
        });
    }
};

//Create a new event
const createEvent = async (req, res) => {
    try {
        const {
            name,
            tagline,
            schedule,
            description,
            moderator,
            category,
            sub_category,
            rigor_rank,
        } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'At least one image is required' });
        }

        if (!name || !schedule || !description || !moderator || !category || !sub_category || !rigor_rank) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        //traversing every image given to store their path into the images array
        const images = req.files.map(file => file.path);

        const newEvent = {
            type: 'event',
            name,
            tagline,
            schedule: new Date(schedule),
            description,
            files: images,
            moderator,
            category,
            sub_category,
            rigor_rank: parseInt(rigor_rank),
            attendees: [],
        };


        const db = await dbConnect();
        const result = await db.collection('events').insertOne(newEvent);

        res.status(201).json({
            message: 'Event created successfully',
            // data: newEvent,
            id: result.insertedId
        });
    } catch (error) {
        res.status(500).json({ error: 'Error creating event', details: error.message });
    }
};

// Update an event
const updateEvent = async (req, res) => {
    const { id } = req.params;
    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                message: 'Invalid Event ID'
            });
        }

        const {
            name,
            tagline,
            schedule,
            description,
            moderator,
            category,
            sub_category,
            rigor_rank,
        } = req.body;


        if (!name || !schedule || !description || !moderator || !category || !sub_category || !rigor_rank) {
            return res.status(400).json({
                message: 'Missing required fields'
            });
        }

        // Initialize the updated fields object
        const updatedFields = {
            ...(name && { name: name }),
            ...(tagline && { tagline }),
            ...(schedule && { schedule: new Date(schedule) }),
            ...(description && { description }),
            ...(moderator && { moderator }),
            ...(category && { category }),
            ...(sub_category && { sub_category }),
            ...(rigor_rank && { rigor_rank: parseInt(rigor_rank) }),
        };

        if (req.files && req.files.length > 0) {
            const images = req.files.map(file => file.path);
            updatedFields.files = images;
        }

        const db = await dbConnect();


        const result = await db.collection('events').updateOne(
            { _id: new ObjectId(id) },
            { $set: updatedFields }
        );

        if (result.matchedCount > 0) {
            res.status(200).json({
                message: 'Event updated successfully',
                data: updatedFields,
            });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error updating event', details: error.message });
    }
};

//Delete an Event
const deleteEvent = async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Event ID' });
    }

    try {
        const db = await dbConnect();
        const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Event deleted successfully' });
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting event', details: error.message });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
};
