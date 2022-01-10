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

const dbLib = require('./db/sql'); 
let db;
const request = require('supertest');
const webapp = require('./server');
const profiles = require('./db/profiles');
const { response } = require('express');

// cleanup the database after each test
const clearDatabase = async () => {
  await knex('players').where('name', '=', 'jtestuser').del();
};

/**
 * If you get an error with afterEach
 * inside .eslintrc.json in the
 * "env" key add - "jest": true -
 */

describe('Create player endpoint API & integration tests', () => {
  
  beforeAll(async () =>{
    db = await dbLib.connect(profiles.profile1);
  });
  
  afterEach(async () => {
     await clearDatabase();
  });

  test('existing player', () => 
  request(webapp).post('/api/player').send('name=jtestuser')
  .expect(409) // testing the response status code
  .then((response) => {
    expect(JSON.parse(response.text).error).toBe('username already exists');
  }));

  test('Endpoint status code and response', () => 
  request(webapp).post('/api/player').send('name=jtestuser&points=0&maxpoints=1')
    .expect(201)
    .then((response) => {
      expect(JSON.parse(response.text).player).toHaveProperty('name', 'jtestuser');
    }));
 
  test('The new player is in the database', () => request(webapp).post('/api/player').send('name=jtestuser&points=0&maxpoints=1')
    .expect(201)
    .then(async () => {
      const newPlayer = await knex.select('name').from('players').where('name', '=', 'jtestuser');
      expect(newPlayer[0].name).toBe('jtestuser');
    }));
});

describe('Get players test', () => {
  beforeAll(async () =>{
    db = await dbLib.connect(profiles.profile1);
  });

  afterEach(async () => {
    await clearDatabase();
  });
  test('retrieve all players', () => {
    request(webapp).post('/api/player').send('name=jtestuser&points=0&maxpoints=1');
    request(webapp).get('/api/players')
    .expect(200) // testing the response status code
    .then((response) => {
      if(JSON.parse(response.text)["data"][0]){
        expect(JSON.parse(response.text)["data"][0].name).toMatch(/testuser/i);
      }
    });
  });
});

describe('Delete user', () => {
  beforeAll(async () =>{
    db = await dbLib.connect(profiles.profile1);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test('delete test user', () => {
    let id;
    request(webapp).post('/api/player').send('name=jtestuser&points=0&maxpoints=1')
    .then((response) => {
      id = response.body.player.id;
      console.log('in delete', response.body.player.id);
    })
    .then(() => {
    console.log('in delete id', id);
    request(webapp).delete(`/api/player/${id}`)
    .expect(404)
   })

    request(webapp).delete(`/api/player/${id+1}`)
    .expect(404)
    .then((response) => {
      expect(JSON.parse(response.text).error).toBe('player not found');
    })
    })
  });

describe('update user', () => {
  beforeAll(async () =>{
    db = await dbLib.connect(profiles.profile1);
  });

  afterEach(async () => {
    await clearDatabase();
  });

  test('update user score', async () => {
    let id;
    request(webapp).post('/api/player').send('name=jtestuser&points=0&maxpoints=1')
    .then((response) => {
      id = JSON.parse(response.text)["player"]["id"];
    })
    request(webapp).put(`/api/player/${id}`).send('name=jtestuser&points=0&maxpoints=2')
    .expect(200)
    .then(async () => {
      const newmax = await knex.select('maxpoints').from('players').where('name', '=', 'jtestuser');
      expect(newmax).toBe(2);
    })
  });
});

test(('invalid url'), () => {
  request(webapp).get('/api/')
  .expect(404)
});
