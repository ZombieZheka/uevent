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
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: [true, "Owner is required"]
  },
  publicity: {
    type: String,
    enum: ['private', 'public'],
    default: 'private',
    required: [true, "Publicity is required"]
  },
  price: {
    type: Number,
    // number: {
    //   type: Number,
    //   default: null
    // }
    // currency: {
    //   type: String,
    //   enum: ['UAN', 'USD', 'EUR'],
    //   default: 'UAN'
    // },
    default: 0,
    min: 0
  },
  capacity: {
    type: Number,
    default: null
  },
  startDate: {
    type: Date,
    required: [true, "Start Date is required"]
  },
  endDate: {
    type: Date,
    required: [true, "End Date is required"]
  },
  images: [{
    data: Buffer,
    contentType: String,
  }]
});

EventSchema.methods.toJSON = function () {
  const { _id, __v, ...event } = this.toObject();
  return event;
}

module.exports = model("Event", EventSchema);
