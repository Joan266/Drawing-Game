import dotenv from "dotenv";
import httpServer from "./express.js";
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import tableController from "./controllers/table.js";
import randomWords from "random-words";
import { DrawingGame } from "./drawing-game.js";
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

    socket.on("messages", (message, nickname, playerId) => {
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
        io.of("/table").to(pathroom).emit("final-word", word);
        io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
      }
    });
    const points = [10,20,30,40];
    socket.on("right-answer", (player) => {
     const turnscore = (counter/DRAWING_MAX_TIME)*80 + points.pop();
    });

    socket.on("start-game", async () => {
      const {gameEnd} = await DrawingGame.prepareNextTurn(0, 0, room);
      if (!gameEnd) {
        randomwords = randomWords(options);
        io.of("/table").to(pathroom).emit("mainplayer-info", randomwords);
      }
    });

    socket.on("start-turn", (data) => {
      startTurn(data.round,data.turn);
    });
    function startTurn(round,turn) {
      setTimeout(() => {
          io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
          console.log(timer);
          async function decrementCounter() {
            if (counter <= 0) {
              if (timer === "timer1") {
                const randomnumber = getRandomNumber();
                timer = "timer2";
                counter = DRAWING_MAX_TIME;
                const finalword = randomwords[randomnumber]
                io.of("/table").to(pathroom).emit("final-word", finalword);
                console.log(timer);
              } else if (timer === "timer2") {
                console.log("cleared interval");
                clearInterval(valId);
                timer = "timer1";
                counter = SELECT_WORD_MAX_TIME;
                const {gameEnd} = await DrawingGame.prepareNextTurn(round, turn + 1, room);
                if (!gameEnd) {
                  randomwords = randomWords(options);
                  io.of("/table").to(pathroom).emit("mainplayer-info", randomwords);
                }
              }
            } else {
              counter--;
            }
            io.of("/table").to(pathroom).emit("current-time", { time: counter, fase: timer });
            console.log("Counter:", counter);
          }
          const valId = setInterval(decrementCounter, 1000);  
      }, 1000);
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


