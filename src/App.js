import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Login from './pages/Login/login';
import Game from './pages/Game/game';
import photoArray from './utils/pics';
import Shuffle from './utils/shuffle';
import Leaderboard from './pages/Leaderboard/leaderboard';

export default function App() {
  const [user, setUser] = useState({});
  const [userList, setUserList] = useState([]);

  const handleCallBackName = (LoginData) => {
    setUser(LoginData);
    setUserList([...userList, LoginData]);
  };

  const pics = Shuffle(photoArray);
  const initNames = [];
  for (let i = 0; i < 4; i += 1) {
    initNames.push(pics[i].name);
  }
  const initNames2 = Shuffle(initNames);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Login parentCallBack={handleCallBackName} />
          </Route>
          <Route exact path="/Game">
            <Game
              user={user}
              photoArray={pics}
              nameList={initNames2}
            />
          </Route>
          <Route exact path="/Leaderboard">
            <Leaderboard user={user} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
