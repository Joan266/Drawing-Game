import Table from "../models/table.js";
import Game from "../models/game.js";
import Chat from "../models/chat.js";
import Players from "../models/players.js";

export const tableController = {
  createtable: async (req, res) => {
    try {
      const tables = await Table.find();
      const idReacher = async () => {
        const ids = tables ? tables.map((table) => table._id) : [];
        let tableId;

        do {
          tableId = Math.floor(Math.random() * 8000) + 1000;
        } while (ids.includes(tableId));

        return tableId;
      };

      const tableId = await idReacher();

      const tableCode = req.body.code;
      const table = new Table({ code: tableCode });
      const game = new Game();
      const chat = new Chat();
      const players = new Players();
      table._id = tableId;
      game._id = tableId;
      chat._id = tableId;
      players._id = tableId;

      await table.save().then(async () => {
        await chat.save();
        await game.save();
        await players.save();
        console.log(`table ${tableId} created`);
        res.json({ tableId });
      });
    } catch (error) {
      console.log(error);
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
