import mongoose from 'mongoose';
import Game from '../schemas/game.js';
// import Artist from '../schemas/artist.js';
import Room from '../schemas/room.js';

export default {
  createGame: async (roomId, callback) => {
    try {
      // Get the users from the room
      const room = await Room.findById(roomId);
      const { users } = room;
      if (users.length < 2) {
        callback({
          success: false,
          message: 'Users number too low to play',
        });
        return;
      }
      // Create a new Game
      const game = new Game({ _id: new mongoose.Types.ObjectId() });
      game.room = roomId;

      game.artists = users;

      // Save the game and update the room
      await game.save();
      room.games.push(game._id);
      await room.save();
      const artistId = game.artists[0];
      console.log(`artistId: ${artistId}, artistId: ${game.artists[0]}`);
      callback({
        success: true,
        message: 'Game created successfully',
        artistId,
        gameId: game._id,
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },
  addWordToGameList: async ({ word, gameId }, callback) => {
    try {
      const game = await Game.findById(gameId);
      if (!game) return;
      game.words = [...game.words, word];
      game.phase = 2;
      await game.save();
      console.log(game);
      callback({
        success: true,
        message: 'Word added successfully',
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },
  userScored: async ({ userId, gameId }, callback) => {
    try {
      // Use Game.findOne instead of Game.findById to properly check for existence
      const game = await Game.findOne({ _id: gameId });

      // Check if the game exists
      if (!game) {
        callback({
          success: false,
          message: 'Game not found',
        });
        return;
      }

      // Check if the user has already scored
      const hasUserScored = game.scores.includes(userId);
      if (hasUserScored) {
        callback({
          success: false,
          message: 'User already scored',
        });
        return;
      }

      // Add user to scores array
      game.scores.push(userId);

      // Save the updated game
      await game.save();

      // Get the index of the user's score in the scores array
      const scoreIndex = game.scores.indexOf(userId);
      const score = game.artists.length - scoreIndex;
      // Respond with success message
      callback({
        success: true,
        message: 'User added to the scores array',
        score,
      });
    } catch (error) {
      console.error(error);

      // Respond with error message
      callback({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },
  isNextArtist: async ({ gameId, artistId }, callback) => {
    try {
      const game = await Game.findById(gameId);
      const artistIndex = game.artists.indexOf(artistId);
      console.log(game);
      console.log(`artistId:${artistId}, artistIndex:${artistIndex}`);
      if (artistIndex === -1) {
        callback({
          success: false,
          message: 'Current artist not found in the artists game array.',
        });
        return;
      }
      game.scores = [];
      await game.save();
      if (artistIndex === game.artists.length - 1) {
        if (game.round === game.total_rounds) {
          callback({
            success: true,
            message: 'No more artists left to play in the last round. End of the game.',
            data: { },
          });
          game.phase = 3;
          await game.save();
          return;
        }

        const nextArtistId = game.artists[0];
        console.log(`nexstArtistId: ${nextArtistId}, artistIndex:${artistIndex}, nexstArtistId: ${game.artists[0]},gameRounds:${game.round}`);
        game.round += 1;
        await game.save();

        callback({
          success: true,
          message: 'No more artists left to play in this round. Moving to the next round.',
          data: { round: game.round, nextArtistId },
        });
        return;
      }

      const nextArtistId = game.artists[artistIndex + 1];
      console.log(`nexstArtistId: ${nextArtistId}, artistIndex:${artistIndex}, nexstArtistId: ${game.artists[artistIndex + 1]}`);
      callback({
        success: true,
        message: 'There is a next artist to play.',
        data: { nextArtistId },
      });
    } catch (error) {
      console.error(error);
      callback({
        success: false,
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  },
};
