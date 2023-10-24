// chatReducer.js
export function chatReducer(messages, action) {
    switch (action.type) {
      case 'ADD_MESSAGE':
        return [...messages, {
            playerNickname: action.playerNickname,
            text: action.text,
          }];
      case 'CLEAR_MESSAGES':
        return {
          ...messages,
          messages: [],
        };
      default:
        return messages;
    }
  }
