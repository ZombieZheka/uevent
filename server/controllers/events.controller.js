// server/controllers/events.controller.js

const {
  User,
<<<<<<< Updated upstream
  Event
=======
  Event,
  Ticket
>>>>>>> Stashed changes
} = require(process.env.MODELS);

module.exports = {
  /**
<<<<<<< Updated upstream
=======
   * Purchase ticket for an event
   * @param {Request} req request
   * @param {Response} res response
   */
  purchaseTicket: async (req, res) => {
    const { eventId } = req.params;
    const { userId } = req.body;

    try {
      const event = await Event.findById(eventId);
      if (!event) {
        res.status(404);
        return res.json({
          success: false,
          message: 'Event not found'
        });
      }

      // Check if maximum ticket capacity is reached
      const soldTicketsCount = await Ticket.countDocuments({ eventId: eventId });
      if (soldTicketsCount >= event.capacity) {
        res.status(400);
        return res.json({
          success: false,
          message: 'Maximum ticket capacity reached'
        });
      }

      // Create ticket
      const ticket = await Ticket.create({
        name: event.name,
        description: event.description,
        organizer: event.organizer,
        price: event.price,
        startDate: event.startDate,
        endDate: event.endDate,
        owner: userId,
        eventId: eventId
      });

      res.status(200);
      return res.json({
        success: true,
        message: 'Ticket purchased successfully',
        ticket: ticket
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Ticket purchase error'
      });
    }
  },

  /**
>>>>>>> Stashed changes
   * Search event
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  findEvent: async (req, res, next) => {
    const {
      id
    } = req.params;

    let event;
    try {
      event = await Event.findOne({ id: id });
    } catch (error) {
      console.error(error);
      res.status(500);
      res.json({
        success: false,
        message: 'Searching Event Error'
      });
    }

    if (!event) {
      res.status(404);
      return res.json({
        success: false,
        message: 'Event not found'
      });
    } else if (event.publicity === 'private'
    && event.owner !== req.user) { // IMPORTANT
      res.status(403);
      return res.json({
        success: false,
        message: 'Event is private'
      });
    }
    req.event = event;
    next();
  },
  /**
   * Check ownership for authentificated user
   * @param {Request} req request
   * @param {Response} res response
   * @param {Function} next next handler
   */
  ownershipRequired: async (req, res, next) => {
    const event = req.event;
    const owner = await User.findById(event.owner);

    if (owner.id !== req.user_id) {
      res.status(403);
      return res.json({
        success: false,
        message: 'Ownership required'
      });
    }
    next();
  },
  /**
   * Search specified event
   * @param {Request} req 
   * @param {Response} res 
   */
  getEvent: async(req, res) => {
    const event = req.event;
    res.status(200);
    return res.json({
      success: true,
      message: 'Event found',
      event: event
    });
  },
  /**
   * Create event
   * @param {Request} req request
   * @param {Response} res response
   */
  postEvent: async(req, res) => {
    const {
      name,
      description,
      publicity,
      price,
      capacity,
      startDate,
      endDate
    } = req.body;
    const user = await User.findOne({ id: req.user_id });

    try {
      const event = await Event.create({
        name: name,
        description: description,
        owner: user,
        publicity: publicity,
        price: price,
        capacity: capacity,
        startDate: startDate,
        endDate: endDate
      });
      res.status(200);
      return res.json({
        success: true,
        message: 'Event created',
        event: event
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Create Event Error'
      });
    }
  },
  /**
   * Update specified event
   * @param {Request} req 
   * @param {Response} res 
   */
  patchEvent: async(req, res) => {
    // const {
    //   name,
    //   description,
    //   publicity,
    //   price,
    //   capacity,
    //   startDate,
    //   endDate
    // } = req.body;

    const event = req.event;
    try {
      Object.keys(req.body).forEach(key => {
        event[key] = req.body[key];
      });
      await event.save();

      res.status(200);
      return res.json({
        success: true,
        message: 'Event updated',
        event: event
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Update Event Error'
      });
    }
    // if (name) {
    //   event.name = name;
    // }
    // if (description) {
    //   event.description = description;
    // }
  },
  /**
   * Remove specified event
   * @param {Request} req request
   * @param {Response} res response
   * @returns 
   */
  deleteEvent: async(req, res) => {
    const event = req.event;
    
    try {
      await Event.deleteOne({ id: event.id });

      res.status(200);
      return res.json({
        success: true,
        message: 'Event deleted'
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Delete Event Error'
      });
    }
  },
  /**
   * Search events
   * @param {Request} req request
   * @param {Response} res response
   */
  getEvents: async (req, res) => {
    const {
      sorting, // { by, order }
      nameRegex,
      priceOptions // : { min, max }
    } = req.body;

    try {
      // searching and sorting options
      let searchOptions = { publicity: 'public'};
      let sortingOptions = { by: 'name', order: 'asc' };
      // set name regex
      if (nameRegex) {
        searchOptions.name = { $regex: new RegExp(`^\\w*${nameRegex}\\w*$`), $options: 'i' };
      }
      // set price options
      if (priceOptions) {
        searchOptions.price = { $gte: priceOptions.min, $lte: priceOptions.max };
      }
      if (sorting) {
        sortingOptions.by = sorting.by || 'name';
        sortingOptions.order = sorting.order || 'asc';
      }
      const events = await Event.find(searchOptions).sort([[sortingOptions.by, sortingOptions.order]]);
      // response about success
      res.status(200);
      const message = events.length === 0 ? 'Events not found' : 'Success';
      return res.json({
        success: true,
        message: message,
        events: events
      });
    } catch (error) {
      console.error(error);
      res.status(500);
      return res.json({
        success: false,
        message: 'Search Events Error'
      });
    }
  }
};
