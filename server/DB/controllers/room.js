import mongoose from 'mongoose';
import Room from '../schemas/room.js';
import User from '../schemas/user.js';

function generateRandomHexColor() {
  // Generate random values for RGB (Red, Green, Blue)
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);

  // Convert RGB to hex format
  const hexRed = red.toString(16).padStart(2, '0');
  const hexGreen = green.toString(16).padStart(2, '0');
  const hexBlue = blue.toString(16).padStart(2, '0');

  // Return the hex color code
  return `#${hexRed}${hexGreen}${hexBlue}`;
}

const generateRandomCode = () => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

export default {
  createRoom: async (req, res) => {
    const { userName } = req.body;
    // Check if userName is missing
    if (!userName) {
      return res.status(400).json({ error: 'userName is required' });
    }
    try {
      // Generate a unique code for the room
      let code;
      const rooms = await Room.find();
      const codes = rooms ? rooms.map((room) => room.code) : [];
      do {
        code = generateRandomCode();
      } while (codes.includes(code));
      // Generate a random color for the user
      const color = generateRandomHexColor();
      // Create a new Room
      const room = new Room({_id: new mongoose.Types.ObjectId(), code });
      // Create a new User
      const owner = new User({ _id: new mongoose.Types.ObjectId(), name: userName, color });
      // Set the owner of the room to the created user
      room.owner = owner._id;
      // Add the user to the users array of the room
      room.users.push(owner._id);
      // Set the room for the user
      owner.room = room._id;
      // Save the user and update the room
      await owner.save();
      await room.save();
      res.status(200).json({
        room: { _id: room._id, code: room.code, owner: room.owner },
        user: { _id: owner._id, color: owner.color, name: owner.name },
        users: [{
          _id: owner._id,
          userName: owner.name,
          color: owner.color,
        }],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create the room' });
    }
  },
  joinRoom: async (req, res) => {
    const { userName, roomCode } = req.body;
    // Check if userName is missing
    if (!userName) {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!roomCode) {
      return res.status(400).json({ error: 'Room code is required' });
    }
    try {
      // Check if the room exists
      const room = await Room.findOne({ code: roomCode });
      if (!room) {
        return res.status(400).json({ error: 'Unexisting room' });
      }
      // Create a new User
      const color = generateRandomHexColor();

      const newUser = new User({ _id: new mongoose.Types.ObjectId(), name: userName, color });
      room.users.push(newUser._id);
      // Set the room for the newUser
      newUser.room = room._id;
      // Save the user
      await newUser.save();
      // Save the updated room
      await room.save();
      // Retrieve users details using populate
      const populatedRoom = await Room
        .findOne({ code: roomCode })
        .populate('users', '_id color name')
        .exec();
      res.status(200).json({
        room: { _id: room._id, code: room.code, owner: room.owner },
        user: { _id: newUser._id, color: newUser.color, name: newUser.name },
        users: populatedRoom.users,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Not able to join the room' });
    }
  },
};
