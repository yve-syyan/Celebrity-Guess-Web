// http://knexjs.org/#Installation-client for MySQL connection
const knex = require('knex')({
  client: 'mysql2',
  connection: {
    host : 'hw4.cjozvl6u1wl2.us-east-2.rds.amazonaws.com',
    port : 3306,
    user : 'admin',
    password : 'yb980223',
    database : 'game'
  }
});

const dbLib = require('./sql'); 
let db;

// cleanup the database after each test
const clearDatabase = async () => {
  await knex('players').where('name', '=', 'testuser').del();
  await knex('players').where('name', '=', 'testuser2').del();
};

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add - "jest": true -
 */

beforeAll(async () =>{
  db = await dbLib.connect();
});

afterEach(async () => {
  await clearDatabase();
});

describe('Database operations tests', () => {
  // test data
  const testPlayer = {
    name: 'testuser',
    points: 0,
    maxpoints:1,
  };
  const testPlayer2 = {
    name: 'testuser2',
    points: 2,
    maxpoints:3,
  };

  test('addPlayer inserts a new player', async () => {
      await dbLib.addUser(db, testPlayer);
      const newPlayer = await knex.select().from('players').where('name', '=', 'testuser');
      expect(newPlayer[0].name).toBe('testuser');
      expect(newPlayer[0].points).toBe(0);
      expect(newPlayer[0].maxpoints).toBe(1);
  });

  test('get all players', async () => {
    await dbLib.addUser(db, testPlayer);
    const allPlayers = await dbLib.getUsers(db)
    expect(allPlayers[0].name).toMatch(/testuser/i);
    expect(allPlayers.length).toBeLessThan(3);
  });

  test('get user by id', async () => {
    const new_id = await dbLib.addUser(db, testPlayer);
    const newPlayer = await dbLib.getUser(db, new_id);
    expect(newPlayer).not.toBeNull();

    const failed_id = await dbLib.getUser(db, new_id+100);
    expect(failed_id.length).toBe(0);
  });

  test('get user by id with invalid id', async() => {
    const new_id = await dbLib.addUser(db, testPlayer);
    const failed_id = new_id + 1
    try {
      await dbLib.getUser(db, failed_id);
    } catch(err) {
      expect(err).toMatch('error');
    }
  })

  test('delete one user', async () => {
    const new_id = await dbLib.addUser(db, testPlayer);
    await dbLib.deletePlayer(db, new_id);
    const rows = await knex.select().from('players').where('id', '=', new_id);
    expect(rows.length).toBe(0);
  });

  test('leader board', async () => {
    const new_id1 = await dbLib.addUser(db, testPlayer);
    const new_id2 = await dbLib.addUser(db, testPlayer2);
    const rows = await dbLib.getLeaders(db, 1);
    expect(rows.length).toBe(1);
    expect(rows[0].maxpoints).toBe(Math.max(testPlayer2.maxpoints, testPlayer.maxpoints));
  })

  test('update player points', async () => {
    const new_id = await dbLib.addUser(db, testPlayer);
    const affectedRows = await dbLib.updateUser(db, new_id, testPlayer2);
    expect(affectedRows).toBe(1);
  });
});