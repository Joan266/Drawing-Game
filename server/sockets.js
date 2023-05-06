import tableController from "./controllers/table.js";
import randomWords from "random-words";
import { DrawingGame } from "./drawing-game.js";

export default (io) => {
    io.of("/table").on("connection", (socket) => {
        socket.on("join_table", (room) => {
            console.log(room);
            socket.join(room);

            socket.on("messages", (message, nickname, playerId) => {
                io.of("/table").to(room).emit("messages", {
                    body: message,
                    nickname: nickname,
                    playerId: playerId
                });
                console.log(`data from:${message},${nickname},${room}`)
            });

            socket.on("mousedown", (offsetX, offsetY) => {
                io.of("/table").to(room).emit("mousedown", {
                    offsetX: offsetX,
                    offsetY: offsetY
                });
            });

            socket.on("mousemove", (offsetX, offsetY) => {
                io.of("/table").to(room).emit("mousemove", {
                    offsetX: offsetX,
                    offsetY: offsetY
                });
            });

            socket.on("mouseover", (offsetX, offsetY) => {
                io.of("/table").to(room).emit("mouseover", {
                    offsetX: offsetX,
                    offsetY: offsetY
                });
            });

            socket.on("createplayer", () => {
                io.of("/table").to(room).emit("createplayer");
                console.log("a player has been created")

            });

            const SELECT_WORD_MAX_TIME = 10;
            const DRAWING_MAX_TIME = 10;

            let counter = SELECT_WORD_MAX_TIME;
            let timer = "timer1";
            const options = {
                exactly: 3,
                formatter: (word) => word.toUpperCase()
            }
            let randomwords = [];
            function getRandomNumber() {
                return Math.floor(Math.random() * 3);
            }
            socket.on("selected-word", (word) => {
                if (timer === "timer1") {
                    timer = "timer2";
                    counter = DRAWING_MAX_TIME;
                    io.of("/table").to(room).emit("final-word", word);
                    io.of("/table").to(room).emit("current-time", { time: counter, fase: timer });
                }
            });
            const points = [10, 20, 30, 40];
            socket.on("right-answer", (player) => {
                const turnscore = (counter / DRAWING_MAX_TIME) * 80 + points.pop();
            });

            socket.on("start-game", () => {
                DrawingGame.gameOn(room)
                console.log("hello")
            });

            socket.on("start-turn", (data) => {
                startTurn(data.round, data.turn);
            });

            function startTurn(round, turn) {
                setTimeout(() => {
                    io.of("/table").to(room).emit("current-time", { time: counter, fase: timer });
                    console.log(timer);
                    async function decrementCounter() {
                        if (counter <= 0) {
                            if (timer === "timer1") {
                                const randomnumber = getRandomNumber();
                                timer = "timer2";
                                counter = DRAWING_MAX_TIME;
                                const finalword = randomwords[randomnumber]
                                io.of("/table").to(room).emit("final-word", finalword);
                                console.log(timer);
                            } else if (timer === "timer2") {
                                console.log("cleared interval");
                                clearInterval(valId);
                                timer = "timer1";
                                counter = SELECT_WORD_MAX_TIME;
                                const { gameEnd } = await DrawingGame.prepareNextTurn(round, turn + 1, room);
                                if (!gameEnd) {
                                    randomwords = randomWords(options);
                                    io.of("/table").to(room).emit("mainplayer-info", randomwords);
                                }
                            }
                        } else {
                            counter--;
                        }
                        io.of("/table").to(room).emit("current-time", { time: counter, fase: timer });
                        console.log("Counter:", counter);
                    }
                    const valId = setInterval(decrementCounter, 1000);
                }, 1000);
            }
        });
    });

    io.of("/table").adapter.on("create-room", (room) => {
        console.log(`${room} has been created.`);
    });

    // io.of("/table").adapter.on("join-room", (room, id) => {
    //     console.log(`socket ${id} has joined room ${room}`);
    // });
    io.of("/table").adapter.on("delete-room", (room) => {
        const req = { body: { room } };
        const res = { json: (response) => console.log(response) };
        tableController.deletetable(req, res);
        console.log(`room ${room} was deleted`);
    });
};