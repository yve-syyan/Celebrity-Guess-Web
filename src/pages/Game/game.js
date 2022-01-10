import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import './game.css';
import Shuffle from '../../utils/shuffle';
import funcs from '../fetch';

export default function Game(props) {
  const history = useHistory();
  const {
    user, photoArray, nameList,
  } = props;
  const id = user.id;
  const [maxScoreChild, setMaxScore] = useState(0);
  const [localuser, setUser] = useState({});
  const [currentScore, setCurrentScore] = useState(0);
  const pics = photoArray;
  const [nameArray, setNameArray] = useState(nameList);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [correctChoice, setCorrectChoice] = useState(pics[correctIndex].name);

  function Getuser() {
    const domain =
      !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
        ? 'http://localhost:5000'
        : '';
    const getUser = async () => {
      await axios.get(`${domain}/api/player/${id}`)
      .then((response) => {
        setMaxScore(response.data[0].maxpoints);
      })
      .catch((error) => {
        console.error(error);
      });
    }
    getUser();
  }

  useEffect(() => {
    Getuser();
    setUser(user);
  }); // call when username changes

  function generateCandidates(index) {
    let indexArray = [];
    for (let v = 0; v < 11; v += 1) {
      indexArray.push(v);
    }
    let sliced3 = [];
    while (true) {
      indexArray = Shuffle(indexArray);
      sliced3 = indexArray.slice(0, 3);
      // randomly pick additional 3 additional non-repeating characters
      if (!sliced3.includes(index)) {
        break;
      }
    }
    let names = [];
    sliced3.forEach((item) => {
      names.push(pics[item].name);
    });
    // push correct choice and shuffle
    names.push(photoArray[index].name);
    names = Shuffle(names);
    return names;
  }

  function unCheck() {
    let x = document.getElementById(`custom-checkbox-${0}`);
    for (let i = 1; i <= 3; i += 1) {
      x.checked = false;
      x = document.getElementById(`custom-checkbox-${i}`);
    }
  }

  function cleanGame() {
    // clean and reset game
    setCorrectIndex(0);
    setCurrentScore(0);
    history.push('/Leaderboard');
  }

  const handleOnChange = (selectedName) => {
    const correctCopy = correctChoice;
    if (selectedName === correctCopy) {
      setCurrentScore(currentScore + 1);
      funcs.Updatescore(localuser, currentScore + 1);
      if (currentScore + 1 > maxScoreChild) {
        setMaxScore(currentScore + 1);
        funcs.Updatemax(localuser, currentScore + 1);
      }
    }
    if (correctIndex === 9) {
      cleanGame();
    } else {
      setNameArray(generateCandidates(correctIndex + 1));
      setCorrectChoice(pics[correctIndex + 1].name);
      setCorrectIndex(correctIndex + 1);
    }
    unCheck();
  };

  return (
    <div>
      <div className="scoreboard">
        <div className="item" id="userName">
          Hi
          {' '}
          {localuser.name}
          !
        </div>
        <div className="item" id="currentScore">
          Current Score:
          {' '}
          {currentScore}
        </div>
        <div className="item" id="bestScore">
          Best Score:
          {' '}
          {maxScoreChild}
        </div>
      </div>
      <div className="card">
        <img className="targetImg" src={pics[correctIndex].file} alt="" />
        <br />
        <ul className="option-list">
          {nameArray.map((name, index) => (
            <li key={`index-${name}`}>
              <div className="list-item">
                <div className="selection">
                  <input
                    type="checkbox"
                    id={`custom-checkbox-${index}`}
                    name={name}
                    value={name}
                    onChange={() => handleOnChange(name)}
                  />
                  <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
