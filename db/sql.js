const mysql = require('mysql2/promise');

// Connect to our db on the cloud
const connect = async () => {
  console.log('attempt connection');
  try {
    const connection = await mysql.createConnection({
      host: 'hw4.cjozvl6u1wl2.us-east-2.rds.amazonaws.com',
      user: 'admin',
      password: 'yb980223',
      database: 'game',
    });
    // Connected to db
    console.log(`Connected to database: ${connection.connection.config.database}`);
    return connection;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const addUser = async (db, newPlayer) => {
  const query = 'INSERT INTO game.players (name, points, maxpoints) VALUES (?, ?, ?)';
  const params = [newPlayer.name, newPlayer.points, newPlayer.maxpoints];
  try {
    const row = await db.execute(query, params);
    return row[0].insertId; 
  } catch (err) {
    throw new Error ('add User failed');
  }
};

const getUsers = async (db) => {
  const query = 'SELECT * FROM game.players';
  const [rows] = await db.execute(query);
  return rows;
}

const getUser = async (db, id) => {
  try {
    const query = 'SELECT * FROM game.players WHERE id=?';
    const [row] = await db.execute(query, [id]);
    return row;
  } catch (err) {
    throw new Error (`get user with id:${id} failed`);
  }
}

const deletePlayer = async (db, id) => {
  try {
    const query = 'DELETE FROM game.players WHERE id=?';
    const [row] = await db.execute(query, [id]);
    return row.affectedRows;
  } catch (err) {
    throw new Error ('delete user failed');
  }
}

const updateUser = async(db, id, newPlayer) => {
  const { name, points, maxpoints } = newPlayer
  try {
    const query = `UPDATE game.players SET name='${name}', points=${points}, maxpoints=${maxpoints} WHERE id=${id}`;
    const [row] = await db.execute(query);
    return row.affectedRows;
  } catch (err) {
    throw new Error ('update user failed');
  }
}


const getLeaders = async (db, cnt) => {
  try {
    const query = `SELECT * FROM game.players ORDER BY maxpoints DESC LIMIT ${cnt}`
    const [rows] = await db.execute(query);
    return rows;
  } catch (err) {
    throw new Error ('get leaders failed');
  }
}

module.exports = {
  connect, addUser, getUsers, deletePlayer, getLeaders, getUser, updateUser
}