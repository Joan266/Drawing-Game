import gameController from '../DB/controllers/game.js';

export default async (socket, code, io) => {
  const startPhase1 = async (data) => {
    const { roomId } = data;
    console.log(`game_client:start_phase_1, roomId: ${roomId}`);
    io.to(code).emit("game_server:start_phase_1");
    gameController.createGame(roomId, (result) => {
      console.log(result.message);
      if (result.success) {
        console.log(result.artistId);
        io.to(code).emit("game_server:start_phase_1", { artistId: result.artistId, gameId: result.gameId });
      }
    });
  };
  const startPhase2 = async (data) => {
    const { word, gameId } = data;
    console.log(`game_client:start_phase_2, wordName: ${word.name}, gameId:${gameId}`);
    gameController.addWordToGameList({ word, gameId }, (result) => {
      console.log(result.message);
      if (result.success) {
        io.to(code).emit("game_server:start_phase_2", { word });
      }
    });
  };
  const endPhase2 = async (data) => {
    const { artistId, gameId } = data;
    console.log(`game_client:end_phase_2`);
    gameController.isNextArtist({ gameId, artistId }, (result) => {
      console.log(result.message);
      if (result.success) {
        console.log(`game_client:end_phase_2 result: ${result.data}`);
        io.to(code).emit("game_server:end_phase_2", result.data);
      }
    });
  };
  const userScored = async (data) => {
    const { userId, gameId } = data;
    console.log(`game_client:user_scored, userId:${userId}`);
    gameController.userScored({ userId, gameId }, (result) => {
      console.log(result.message);
      if (result.success) {
        console.log(`game_client:user_scored score result: ${result.score}`);
        io.to(code).emit("game_server:user_scored", { score: result.score, userId });
      }
    });
  };
  socket.on('game_client:start_phase_1', startPhase1);
  socket.on('game_client:start_phase_2', startPhase2);
  socket.on('game_client:end_phase_2', endPhase2);
  socket.on('game_client:user_scored', userScored);
};
