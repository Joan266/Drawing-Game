import Player from "./models/player.js";
import Game from "./models/game.js";

export class DrawingGame {
  static async startNewRound({ tableNumber, round }) {
    await Player.updateMany({ tableId: tableNumber }, { playerTurn: false });

    const game = await Game.findOneAndUpdate(
      { tableId: tableNumber },
      {
        round: round,
        turn: 0,
      },
      { new: true }
    );

    return game;
  }

  static async maybeSetNextArtist({ tableNumber, turn }) {
    const player = await Player.findOneAndUpdate(
      { playerTurn: false, tableId: tableNumber },
      { playerTurn: true },
      { new: true }
    );

    if (player) {
      const game = await Game.findOneAndUpdate(
        { tableId: tableNumber },
        {
          mainPlayerId: player._id,
          turn: turn,
        },
        { new: true }
      );

      console.log('game', game);
      return {
        mainPlayerId: player._id,
        mainPlayerNickname: player.playerNickname,
        turn: game.turn,
      };
    }
  }
}
