import Table from "../models/table.js";
import Game from "../models/game.js";
import Chat from "../models/chat.js";
import Players from "../models/players.js";

export const tableController = {
  createtable: async (req, res) => {
    try {
      const tables = await Table.find();
      const ids = tables ? tables.map((table) => table._id) : [];
      let tableId;

    do {
        tableId = Math.floor(Math.random() * 8000) + 1000;
      } while (ids.includes(tableId));

      const tableCode = req.body.code;

      const table = new Table({ _id: tableId, code: tableCode });
      const game = new Game({ _id: tableId });
      const chat = new Chat({ _id: tableId });
      const players = new Players({ _id: tableId });

      await Promise.all([
        table.save(),
        chat.save(),
        game.save(),
        players.save(),
      ]);

      console.log(`Table ${tableId} created`);
      res.json({ tableId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear la tabla' });
    }
  },
  checktable: (req, res) => {
    const { tableNumber, tableCode } = req.body;
    Table.findById(tableNumber)
      .then((table) => {
        if (table) {
          if (table.code === tableCode) {
            res.json({ valid: true, cb: "Congrats" });
          } else {
            res.json({ valid: false, cb: "The code is wrong" });
          }
        } else {
          res.json({ valid: false, cb: "The table does not exits" });
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
