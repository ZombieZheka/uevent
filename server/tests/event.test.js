// server/tests/event.test.js

const {
  User,
  Event
} = require(process.env.MODELS);

let owner;

async function createOwner() {
  try {
    owner = await User.create({
      firstName: 'Event',
      secondName: 'Owner',
      email: 'event@owner.com',
      password: 'eventOwner'
    });
  } catch (error) {
    console.error(error);
  }
}

async function createEventTest() {
  await createOwner();
  return await Event.create({
    name: 'Event',
    owner: owner,
    publicity: 'public',
    capacity: 20,
    startDate: new Date(),
    endDate: new Date()
  });
}

module.exports = {
  // createEventTest
}
  