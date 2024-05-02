// server/models/ticket.js

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        ref: 'User',
    },
    event_id: {
        type: String,
        required: true,
        ref: 'Event',
    },
    ticket_code: {
        type: String,
        required: true,
    },
    is_paid: {
        type: Boolean,
        default: false,
    },
    purchase_date: {
        type: Date,
        default: Date.now,
    },
});

const Ticket = mongoose.model('Ticket', TicketSchema);

export default Ticket;
