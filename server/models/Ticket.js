const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    organizer: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true }
});

module.exports = ticketSchema;
