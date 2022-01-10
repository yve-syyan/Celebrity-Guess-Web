import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import funcs from '../fetch';

function renderTableData(leaders) {
  return leaders.map((user) => (
    <tr key={user.id}>
      <td className="col-1" id={user.id}>{user.name}</td>
      <td className="col-2">{user.maxpoints}</td>
    </tr>
  ));
}

export default function Leaderboard(props) {
  const { user } = props;
  const history = useHistory();
  const [leaders, setLeaders] = useState([]);
  const [showall, setShowAll] = useState(false);
  const [title, setTitle] = useState('Leader Board');
  const domain =
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : '';
  // display only top n leaders, n=5
  async function Getleader(n = 5) {
    await axios.get(`${domain}/api/leaders/${n}`)
      .then((response) => {
        setLeaders(response.data.data);
      })
      .then(console.log(leaders))
      .catch((error) => {
        console.error(error);
      });
  }

  // display all users
  const displayAll = () => {
    async function Getusers() {
      await axios.get(`${domain}/api/players`)
        .then((response) => {
          setLeaders(response.data.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    Getusers();
  };

  useEffect(async () => {
    if (showall) {
      displayAll();
      setTitle('All Players');
    } else {
      Getleader(5);
    }
  }, [showall]);

  const removeUser = () => {
    // delete from db
    funcs.Deleteuser(user);
    history.push('/');
  };

  const routeChangeReplay = () => {
    history.push('/Game');
  };

  const routeChangeExit = () => {
    history.push('/');
  };

  return (
    <div>
      <div className="main">
        <h2 className="title" align="center">{title}</h2>
        <div>
          <table className="dataTable">
            <thead>
              <tr>
                <th className="col-1">Player Name</th>
                <th className="col-2">Best Score</th>
              </tr>
            </thead>
            <tbody>
              {renderTableData(leaders)}
            </tbody>
          </table>
        </div>
      </div>
      <nav className="as">
        <button type="submit" id="b1" onClick={() => removeUser()}>Remove User</button>
        <button type="submit" id="b2" onClick={() => setShowAll(true)}> Show All User</button>
        <button type="submit" id="b3" onClick={() => setShowAll(false)}> Show Leaders</button>
        <button type="submit" id="b4" onClick={routeChangeReplay}>Retry</button>
        <button type="submit" id="b5" onClick={routeChangeExit}> Replay With a New Name </button>
      </nav>
    </div>
  );
}
