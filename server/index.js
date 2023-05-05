import dotenv from "dotenv";
import httpServer from "./express.js";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import tableController from "./controllers/table.js";
import playerController from "./controllers/player.js";
import randomWords from "random-words";
// import rwe from "random-words-es";
dotenv.config(); // Load environment variables from .env file


const port = process.env.PORT || 8000; // Use the value of the PORT environment variable, or default to 8000

const mongoUrl = process.env.MONGODB_URI;


// Connect to the MongoDB database
mongoose.connect(mongoUrl)
  .catch((error) => console.error(error))
  .then(() => {
    // Start the HTTP server
    httpServer.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  });



const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
});


// server-side
io.of("/table").on("connection", (socket) => {
  socket.on("join_table", (room) => {
    const pathroom = "/table/" + room;
    socket.join(pathroom);

    socket.on("messages", (message, nickname) => {
      io.of("/table").to(pathroom).emit("messages", {
        body: message,
        nickname: nickname,
        playerId: playerId
      });
      console.log(`data from:${message},${nickname},${pathroom}`)
    });

    socket.on("mousedown", (offsetX, offsetY) => {
      io.of("/table").to(pathroom).emit("mousedown", {
        offsetX: offsetX,
        offsetY: offsetY
      });
    });

    socket.on("mousemove", (offsetX, offsetY) => {
      io.of("/table").to(pathroom).emit("mousemove", {
        offsetX: offsetX,
        offsetY: offsetY
      });
    });

    socket.on("mouseover", (offsetX, offsetY) => {
      io.of("/table").to(pathroom).emit("mouseover", {
        offsetX: offsetX,
        offsetY: offsetY
      });
    });

    socket.on("createplayer", () => {
      io.of("/table").to(pathroom).emit("createplayer");
      console.log("a player has been created")

    });
    // async function myGame() {
    //   var mainPlayerId = null;
    //   var round = null;
    //   const remainingTime = { timer1: 10, timer2: 10 };
    //   const options = {
    //     exactly: 3,
    //     formatter: (word) => word.toUpperCase()
    //   }
    //   function getRandomNumber() {
    //     return Math.floor(Math.random() * 3);
    //   }
    //   let counter = remainingTime.timer1;
    //   let timer = "timer1";
    //   socket.on("selected-word", (word) => {
    //     console.log(word);
    //     if (timer === "timer1") {
    //       timer = "timer2";
    //       counter = remainingTime.timer2;
    //       io.of("/table").to(pathroom).emit("final-word", word);
    //       io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
    //     }
    //   });
    //   const req = { body: { tableNumber: room } };
    //   console.log(req);
    //   for (let i = 0; i < 3; i++) {
    //     await new Promise((resolve) => {
    //       playerController.restartplayersturn(req, { json: resolve });
    //     });

    //     round = i;

    //     let u = 0;
    //     let noMatchingPlayers = false;
    //     while (u <= 8 && !noMatchingPlayers) {

    //       console.log(i, u);

    //       const findNextPlayer = (req) => {
    //         return new Promise((resolve, reject) => {
    //           const res = {
    //             json: (player) => {
    //               if (player) {
    //                 console.log(player);
    //               } else {
    //                 noMatchingPlayers = true;
    //                 console.log(noMatchingPlayers);
    //               }
    //               resolve();
    //             },
    //             // If there's an error, reject the Promise with the error message
    //             send: (error) => reject(error),
    //           };

    //           playerController.findnextplayer(req, res);
    //         });

    //       };

    //       // Call the function and log the player info
    //       findNextPlayer(req);

    //       const randomWord = rw(options);

    //       try {
    //         await new Promise((resolve, reject) => {
    //           setTimeout(() => {
    //             if (!noMatchingPlayers) {
    //               io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
    //               io.of("/table").to(pathroom).emit("word-options", randomWord);
    //               console.log(timer);
    //               function decrementCounter() {
    //                 if (counter <= 0) {
    //                   if (timer === "timer1") {
    //                     const randomNumber = getRandomNumber();
    //                     timer = "timer2";
    //                     counter = remainingTime.timer2;
    //                     io.of("/table").to(pathroom).emit("final-word", randomWord[randomNumber]);
    //                     console.log(timer);
    //                   } else if (timer === "timer2") {
    //                     console.log("cleared interval");
    //                     clearInterval(valId);
    //                     timer = "timer1";
    //                     counter = remainingTime.timer1;
    //                     resolve();
    //                   }
    //                 } else {
    //                   counter--;
    //                 }
    //                 io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
    //                 console.log("Counter:", counter);
    //               }
    //               const valId = setInterval(decrementCounter, 1000);
    //             } else {
    //               console.log("loop ended");
    //               reject("No matching players found");
    //             }
    //           }, 1000);
    //         });
    //       } catch (error) {
    //         console.log(error);
    //         // Handle the error here
    //       }


    //       u++;
    //     }



    //   };
    // }
    const remainingTime = { timer1: 10, timer2: 10 };
    let counter = remainingTime.timer1;
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
        counter = remainingTime.timer2;
        io.of("/table").to(pathroom).emit("final-word", word);
        io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
      }
    });
    const points = [10,20,30,40];
    socket.on("right-answer", (player) => {
     const turnscore = (counter/remainingTime.timer2)*80 + points.pop();
    });

    const restartRound = (req) => {
      return new Promise((resolve) => {
        playerController.restartround(req, { json: resolve });
      });
    }
    socket.on("start-game", () => {
      findNextPlayer(0, 0);
    });
    const findNextPlayer = (round, turn) => {
      console.log(round, turn);
      return new Promise((resolve, reject) => {
        const res = {
          json: (playerInfo) => {
            if (playerInfo && turn < 9) {
              console.log(playerInfo);
              randomwords = randomWords(options);
              io.of("/table").to(pathroom).emit("mainplayer-info", randomwords);
            } else {
              if (round < 4) {
                restartRound({
                  tableNumber: room,
                  round: round + 1
                }).then((game) => {
                  findNextPlayer(game.round, game.turn);
                });
              } else {
                restartRound({
                  tableNumber: room,
                  round: 0
                })
                console.log("Game end");
              };

            }
            resolve();
          },
          send: (error) => reject(error),
        };

        playerController.findnextplayer({ tableNumber: room, turn: turn }, res);
      });

    };
    socket.on("start-turn", (data) => {
      playerTurn(data.round,data.turn);
    });
    async function playerTurn(round,turn) {

      try {
        await new Promise((resolve) => {
          setTimeout(() => {
           
              io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
              console.log(timer);
              function decrementCounter() {
                if (counter <= 0) {
                  if (timer === "timer1") {
                    const randomnumber = getRandomNumber();
                    timer = "timer2";
                    counter = remainingTime.timer2;
                    const finalword = randomwords[randomnumber]
                    io.of("/table").to(pathroom).emit("final-word", finalword);
                    console.log(timer);
                  } else if (timer === "timer2") {
                    console.log("cleared interval");
                    clearInterval(valId);
                    timer = "timer1";
                    counter = remainingTime.timer1;
                    findNextPlayer(round, turn + 1);
                    resolve();
                  }
                } else {
                  counter--;
                }
                io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
                console.log("Counter:", counter);
              }
              const valId = setInterval(decrementCounter, 1000);
            
          }, 1000);
        });
      } catch (error) {
        console.log(error);
        // Handle the error here
      }

    }

  });
});

io.of("/table").adapter.on("create-pathroom", (room) => {
  console.log(`room ${room} was created`);
});

io.of("/table").adapter.on("join-pathroom", (room, id) => {
  console.log(`socket ${id} has joined pathroom ${room}`);
});
io.of("/table").adapter.on("delete-pathroom", (room) => {
  const req = { body: { room } };
  const res = { json: (response) => console.log(response) };
  tableController.deletetable(req, res);
  console.log(`room ${room} was deleted`);
});

export default io;


