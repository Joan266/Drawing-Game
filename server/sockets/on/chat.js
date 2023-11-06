import Players from '../../DB/models/schemas/players';
import Game from '../../DB/models/schemas/game';

export default async (roomId, socket, io) => {
  const chatMessage = async (data) => {
    const {
      playerId,
      playerNickname,
      messageInput,
      gamePhase,
      word,
    } = data;
    try {
      if (messageInput && messageInput.toUpperCase() === word?.toUpperCase() && gamePhase === "guess") {
        // Find players in the roomId
        const { playerArray, turnScoreCount, playerCount } = await Players.findById(roomId);
        // Find the current player
        const player = playerArray.find((obj) => obj._id.toString() === playerId);
        const { scoreTurn } = player;

        if (!scoreTurn) {
          // Filter players who can score
          if (turnScoreCount === (playerCount - 2)) {
            await Game.findByIdAndUpdate(
              roomId,
              { fase: "guess-end-phase" },
            );
          }

          // Update the player's score and set their turn to true
          await Players.findByIdAndUpdate(
            roomId,
            {
              "playerArray.$[player].scoreTurn": true,
              $inc: { turnScoreCount: 1 },
            },
            { arrayFilters: [{ "player._id": playerId }] },
          );
        }
      } else {
        io.to(roomId).emit('chat:message', { messageInput, playerNickname });
      }
    } catch (error) {
      console.error(error);
    }
  };
  socket.on('chat:message', chatMessage);
};
