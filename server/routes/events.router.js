// server/routes/events.router.js

const express = require('express');
const router = express.Router();

const {
  layout,
  events
} = require(process.env.CONTROLLERS);

// get event with specified id
router.get(
  '/:id',
  events.findEvent,
  events.getEvent
);

// patch event
router.patch(
  '/:id',
  layout.authentificate,
  layout.authRequired,
  events.findEvent,
  events.ownershipRequired,
  events.patchEvent
);

// delete event
router.delete(
  '/:id',
  layout.authentificate,
  layout.authRequired,
  events.findEvent,
  events.ownershipRequired,
  events.deleteEvent
);

// post event
router.post(
  '/',
  layout.authentificate,
  layout.authRequired,
  events.postEvent
);

// get events
router.get(
  '/',
  events.getEvents
);

module.exports = router;
