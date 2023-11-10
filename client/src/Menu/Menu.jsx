import React, { useReducer } from "react";
import styles from './Menu.module.scss'; 
import JoinGame from './components/JoinGame';
import CreateGame from './components/CreateGame';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

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
    <Container className={styles.menu}  fluid="md">
      <Row>
        <h1>DoodleCharm</h1>
      </Row>
      <Row>
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
      </Row>
    </Container>
  );
}

const Menu = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <FillExample />
  );
};

export default Menu;
