import Game from "../schemas/game.js";

const generateRandomCode = () => {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code = '';

  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }

  return code;
};

export const roomController = {
  createRoom: async (req, res) => {
    try {
      const games = await Game.find();
      const ids = games ? games.map((game) => game._id) : [];
      let id;
      do {
        id = generateRandomCode();
      } while (ids.includes(id));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Not able to create the room' });
    }
  },
  joinRoom: async (req, res) => {
  
  },
};
