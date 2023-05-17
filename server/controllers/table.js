import Table from "../models/table.js";
import Game from "../models/game.js";
import Messages from "../models/chat.js";

export const tableController = {
  createtable: (req, res) => {
    Table.find()
      .then(async (tables) => {
        if (tables) {
          const ids = tables.map((table) => table._id);
          while (true) {
            var tableId = Math.floor(Math.random() * (9000)) + 1000;
            if (!ids.includes(tableId)) {
              break;
            }
          }
        } else {
          var tableId = Math.floor(Math.random() * (9000)) + 1000;
        }
        const tableCode = req.body.code;
        const table = new Table({ code: tableCode });
        const game = new Game();
        const messages = new Messages();
        table._id = tableId;
        game._id = tableId;
        messages._id = tableId;
        await table.save().then(async (table) => {
          await messages.save();
          await game.save();
          res.json(table);
        });
      })
      .catch((error) => {
        console.log(error);
      });
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
  deletetable: (req, res) => {
    const tableNumber = req.body.room;
    Table.deleteOne({ _id: tableNumber })
      .then(() => {
        Game.deleteOne({ _id: tableNumber })
          .then(() => {
            res.json({ message: "Table deleted successfully" });
          })
          .catch((error) => res.json({ message: error }));
      })
      .catch((error) => res.json({ message: error }));
  },
};
