import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './login.css';
import funcs from '../fetch';

export default function Login(props) {
  const [userName, setUserName] = useState('');
  const { parentCallBack } = props;
  const history = useHistory();

  const handleClick = (userName, callback, history) => {
    funcs.Postuser(userName)
    .then((response) => {
        return response.player;
      })
    .then((response) => {
      console.log(response);
      callback(response);
    });
    history.push('/Game');
  };

  return (
    <div className="main">
      <p className="sign" align="center">Sign in</p>
      <br />
      <input
        className="input"
        type="text"
        name="username"
        onChange={(event) => setUserName(event.target.value)}
        placeholder="Enter Your Name"
        required
      />
      <br />
      <button type="submit" className="submit" onClick={() => handleClick(userName, parentCallBack, history)}>Enter Game</button>
    </div>
  );
}
