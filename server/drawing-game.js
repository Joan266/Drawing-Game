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
    )

    return game;
  }
}
