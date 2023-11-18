import React from "react";
import styles from './Menu.module.scss';
import JoinGame from './components/JoinGame';
import CreateGame from './components/CreateGame';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';

const Menu = () => {
  return (
   
          <div className={styles.menu}>
            
         <div className={styles.menuForms}>
            <Tab.Container >
            <div className={styles.menuNavs}>
          <Nav variant="tabs" className="flex-row" fill>
            <Nav.Item>
              <Nav.Link eventKey="create">Create a game</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="join">Join a game</Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
                <Tab.Content>
                  <Tab.Pane eventKey="create">
                      <CreateGame />
                  </Tab.Pane>
                  <Tab.Pane eventKey="join">
                      <JoinGame />
                  </Tab.Pane>
                </Tab.Content>
              
      </Tab.Container>
            </div>
 
            <div className={styles.menuTitle}>
              <h1>Doodle</h1>
              <h1>Charm</h1>
              <h1>Doodle</h1>
              <h1>Charm</h1>
            </div>
            <div className={styles.menuTitle}>
              <h1>Charm</h1>
              <h1>Doodle</h1>
              <h1>Charm</h1>
              <h1>Doodle</h1>
            </div>
          </div>
  );
};

export default Menu;

