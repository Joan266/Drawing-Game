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

      console.log("game", game);
      return {
        mainPlayerId: player._id,
        mainPlayerNickname: player.playerNickname,
        turn: game.turn,
      };
    }
  }

  static async prepareNextTurn(round, turn, room) {
    console.log("round", round, "turn", turn);
    const playerInfo = await DrawingGame.maybeSetNextArtist({
      tableNumber: room,
      turn: turn,
    });
    if (playerInfo && turn < 9) {
      console.log("playerInfo", playerInfo);

      return { gameEnd: false };
    } else {
      if (round < 4) {
        const game = await DrawingGame.startNewRound({
          tableNumber: room,
          round: round + 1,
        });

        return await this.prepareNextTurn(game.round, game.turn, room);
      } else {
        await DrawingGame.startNewRound({
          tableNumber: room,
          round: 0,
        });
        console.log("Game end");
        return { gameEnd: true };
      }
    }
  }
}
