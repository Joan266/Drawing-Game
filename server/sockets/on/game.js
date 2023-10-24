import Players from '../../DB/models/schemas/players';
import Game from '../../DB/models/schemas/game';

export default async (room, socket) => {
  const gameStart = async () => {
    await Game.findByIdAndUpdate(
      room,
      { gamePhase: true },
    );
  };
  const gameRestart = async () => {
    await Players.findByIdAndUpdate(
      room,
      {
        $set: {
          "playerArray.$[].artistTurn": false, "playerArray.$[].scoreTurn": false,
        },
        roundArtistCount: 0,
        turnScoreCount: 0,
      },
    );
    await Game.findByIdAndUpdate(
      room,
      {
        artistId: null,
        turn: 0,
        wordGroup: [],
        round: 0,
        gamePhase: null,
        gameStatus: false,
        word: null,
      },
    );
  };
  const gameStop = async () => {
    await Game.findByIdAndUpdate(
      room,
      { gameStatus: false },
    );
  };

  socket.on('game:start', gameStart);
  socket.on('game:restart', gameRestart);
  socket.on('game:stop', gameStop);
};
