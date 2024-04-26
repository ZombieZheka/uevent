// server/models/Event.js

const {
  Schema,
  Types,
  model
} = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const EventSchema = Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  description: {
    type: String
  },
  price: {
    number,
    currency: {
      type: String,
      enum: ['UAN', 'USD', 'EUR']
    },
    default: {
      number: 0,
      currency: null
    }
  },
  images: [{
    data: Buffer,
    contentType: String,
  }]
});

EventSchema.methods.toJSON = () => {
  const { _id, __v, ...event } = this.toObject();
  return event;
}

module.exports = model("Event", EventSchema);
