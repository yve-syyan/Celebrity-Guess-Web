import axios from 'axios';
const domain =
!process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : '';

const Postuser = async(userName) => {
  if (userName.match(/[A-Za-z0-9]/)) {
    // populate username to parent
    const player = {
      name: userName,
      points: 0,
      maxpoints: 0,
    };
    const response = await axios.post(`${domain}/api/player`, player)
        .then((res) => res.data)
        .catch(() => 'ERROR');
      return response;
  } else {
    alert(' Invalid Username! ');
    return;
  }
}

function Updatemax(user, newScore) {
  const sentPutRequest = async () => {
    try {
      const resp = await axios({
        method: 'PUT',
        url: `${domain}/api/player/${user.id}`,
        data: {
          ...user,
          maxpoints: newScore,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };
  sentPutRequest();
}

function Updatescore(user, newScore) {
  const sentPutRequest = async () => {
    try {
      await axios({
        method: 'PUT',
        url: `${domain}/api/player/${user.id}`,
        data: {
          ...user,
          points: newScore,
        },
      });
    } catch (e) {
      console.error(e);
    }
  };
  sentPutRequest();
}

function Deleteuser(user) {
  const domain =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : '';

  const sentDeleteRequest = async () => {
    try {
      await axios({
        method: 'DELETE',
        url: `${domain}/api/player/${user.id}`,
      });
    } catch (e) {
      console.error(e);
    }
  };
  sentDeleteRequest();
}

export default {
  Postuser, Updatemax, Updatescore, Deleteuser,
};
