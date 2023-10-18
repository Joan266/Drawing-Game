import { createContext, useContext, useReducer } from 'react';

const RoomContext = createContext(null);

const RoomDispatchContext = createContext(null);

export function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

 function RoomProvider({ children }) {
  const [Room, dispatch] = useReducer(
    RoomReducer,
    initialRoom
  );

  return (
    <RoomContext.Provider value={Room}>
      <RoomDispatchContext.Provider value={dispatch}>
        {children}
      </RoomDispatchContext.Provider>
    </RoomContext.Provider>
  );
}

export function useRoom() {
  return useContext(RoomContext);
}

export function useRoomDispatch() {
  return useContext(RoomDispatchContext);
}

function RoomReducer(Room, action) {
  switch (action.type) {
    case 'added': {
      return [...Room, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return Room.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return Room.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialRoom = [
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
