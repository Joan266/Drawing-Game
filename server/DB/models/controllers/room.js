import Table from "../schemas/table.js";
import Game from "../schemas/game.js";
import Chat from "../models/chat.js";
import Players from "../schemas/players.js";

export const tableController = {
  createtable: async (req, res) => {
    try {
      const tables = await Table.find();
      const ids = tables ? tables.map((table) => table._id) : [];
      let room;

    do {
        room = Math.floor(Math.random() * 8000) + 1000;
      } while (ids.includes(room));

      const tableCode = req.body.code;

      const table = new Table({ _id: room, code: tableCode });
      const game = new Game({ _id: room });
      const chat = new Chat({ _id: room });
      const players = new Players({ _id: room });

      await Promise.all([
        table.save(),
        chat.save(),
        game.save(),
        players.save(),
      ]);

      console.log(`Table ${room} created`);
      res.json({ room });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Not able to create the table' });
    }
  },
  checktable: (req, res) => {
    const { room, code } = req.body;
    Table.findById(room)
      .then((table) => {
        if (table) {
          if (table.code === code) {
            res.json({ validCode: true, msg: "Congrats" });
          } else {
            res.json({ validCode: false, msg: "The code is wrong" });
          }
        } else {
          res.json({ validCode: false, msg: "The game doesn't exist" });
        }
      })
      .catch((error) => res.json({ message: error }));
  },
  deletetable: async (room) => {
    const tableNumber = room;
    try {
      const deletePromises = [
        Table.deleteOne({ _id: tableNumber }),
        Game.deleteOne({ _id: tableNumber }),
        Chat.deleteOne({ _id: tableNumber }),
        Players.deleteOne({ _id: tableNumber }),
      ];

      await Promise.all(deletePromises);

      console.log(`Table ${tableNumber} models deleted successfully`);
    } catch (error) {
      console.error(error);
    }
  },
};
