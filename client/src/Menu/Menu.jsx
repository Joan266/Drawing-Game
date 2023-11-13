import React, { useReducer } from "react";
import styles from './Menu.module.scss'; 
import JoinGame from './components/JoinGame';
import CreateGame from './components/CreateGame';
import { Tabs, Tab } from 'react-bootstrap';

const initialState = {
  showJoinGame: false,
  showCreateGame: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_JOIN_GAME":
      return { showJoinGame: !state.showJoinGame, showCreateGame: false };
    case "TOGGLE_CREATE_GAME":
      return { showJoinGame: false, showCreateGame: !state.showCreateGame };
    default:
      return state;
  }
};

function FillExample() {
  return (
    <>
      <div className={styles.menu}>
        <div className={styles.menuTitle}>
          <h1>DoodleCharm</h1>
        </div>
        <div className={styles.menuForms}>
            <Tabs
              defaultActiveKey="create"
              id="fill-tab-example"
              className="mb-3"
              fill
            >
              <Tab eventKey="create" title="CreateGame">
                <CreateGame />
              </Tab>
              <Tab eventKey="join" title="JoinGame">
                <JoinGame />
              </Tab>
            </Tabs>
        </div>
      </div>
    </>
  );
}

const Menu = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FillExample />
  );
};

export default Menu;
