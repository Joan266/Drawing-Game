const SET_ARTIST_ID = 'SET_ARTIST_ID';
const SET_GAME_ID = 'SET_GAME_ID';
const SET_WORD = 'SET_WORD';
const SET_RANDOM_WORDS = 'SET_RANDOM_WORDS';
const SET_IS_WORD = 'SET_IS_WORD';
const SET_ROUND = 'SET_ROUND';
const initialGameState = {
  gameId: String,
  artistId: String,
  word: String,
  round:1,
  isWord: false,
  randomWords: [],
};

const gameReducer = (state, action) => {
  switch (action.type) {
    case SET_ARTIST_ID:
      return { ...state, artistId: action.payload };
    case SET_GAME_ID:
      return { ...state, gameId: action.payload };
    case SET_WORD:
    return { ...state, word: action.payload };
    case SET_RANDOM_WORDS:
    return { ...state, randomWords: action.payload };
    case SET_IS_WORD:
    return { ...state, isWord: action.payload };
    case SET_ROUND:
    return { ...state, round: action.payload };
    default:
      return state;
  }
};

export { SET_ROUND, SET_IS_WORD, SET_RANDOM_WORDS, SET_WORD, SET_GAME_ID, SET_ARTIST_ID, initialGameState, gameReducer };
