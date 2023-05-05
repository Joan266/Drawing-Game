import Table from "../models/table.js";
import Game from "../models/game.js";

var tableController = {
    createtable: (req, res) => {
        Table.find()
            .then((table) => {
                if (table) {
                    var ids = table.map((table) => table.id);
                    while (true) {
                        var tableId = Math.floor(Math.random() * (900)) + 100;
                        if (!ids.includes(tableId)) {
                            break;
                        };
                    }

                } else {
                    var tableId = Math.floor(Math.random() * (900)) + 100;
                }
                var table = new Table({ ...req.body, tableId });
                var game = new Game({ tableId: tableId });

                table.save()
                    .then((table) => {
                        game.save()
                            .then((game) => {
                                res.json(table);
                                console.log(table, game);
                                console.log(`game in room:${tableId} created`);
                            })
                            .catch((error) => res.json({ message: error }));
                    })
                    .catch((error) => res.json({ message: error }));


            })
            .catch((error) => {
                console.log(error);
            });



    },
    checktable: (req, res) => {
        const tableNumber = req.body.tableNumber;
        const tableCode = req.body.tableCode;

        Table.findOne({ tableId: tableNumber })
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
        Table.deleteOne({ tableId: tableNumber })
            .then(() => {
                Game.deleteOne({ tableId: tableNumber })
                    .then(() => {
                        res.json({ message: "Table deleted successfully" });
                    })
                    .catch((error) => res.json({ message: error }));
            })
            .catch((error) => res.json({ message: error }));
    }

}

export default tableController;




