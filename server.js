// Create express app
const express = require('express');
const webapp = express();
const lib = require('./db/sql');
const cors = require('cors');
const path = require('path');
const profiles = require('./db/profiles');
const port = process.env.PORT || 5000;

webapp.use(express.json());
webapp.use(cors());
webapp.use(
  express.urlencoded({
    extended: true,
  })
);
webapp.use(express.static(path.join(__dirname, './client/build')));

let db; 
webapp.listen(port, async () => {
  console.log(`Server running on port:${port}`);
  try {
    db = await lib.connect(profiles.profile1);
    console.log(`Server running on port:${port}`);
  } catch (err) {
    console.error(err);
    throw new Error("connection to db failed");
  }
});

webapp.post('/api/player', async (req, res) => {
  if (!req.body.name) {
    res.status(404).json({ error: 'missing name' });
    return;
  }
  // create new player object
  const newPlayer = {
    name: req.body.name,
    points: req.body.points,
    maxpoints: req.body.maxpoints,
  };
  try {
    const result = await lib.addUser(db, newPlayer);
    res.status(201).json({
      player: { id: result, ...newPlayer },
    });
  } catch (err) {
    res.status(409).json({ error: "username already exists" });
  }
});

webapp.get('/api/players', async(_req, res) => {
  const results = await lib.getUsers(db);
  res.status(200).json({ data: results });
})

webapp.get('/api/player/:id', async(req, res) => {
  if (req.params.id === undefined) {
    res.status(404).json({ error: "invalid id"});
  }
  try {
    const results = await lib.getUser(db, req.params.id);
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(404).json({ error: "player not found" });
  }
})

webapp.put('/api/player/:id', async(req, res) => {
  if (req.params.id === undefined) {
    res.status(404).json({ error: "invalid id"});
  } try {
    const results = await lib.updateUser(db, req.params.id, req.body);
    if (Number(results) === 0) {
      res.status(404).json({ error:'player not found' });
      return;
    }
    res.status(200).json({message:'updated player successfully'});
  } catch (err) {
    res.status(404).json({error:err.message})
  }
});

webapp.delete('/api/player/:id', async(req, res) => {
  if (req.params.id === undefined) {
    res.status(404).json({ error: "invalid id"});
    return;
  }
  try {
    const result = await lib.deletePlayer(db, req.params.id)
    if (Number(result) === 0) {
      res.status(404).json({ error:'player not found' });
      return;
    }
    res.status(200).json({message:`deleted player with id: ${id}`});
  } catch (err) {
    res.status(404).json({error:err.message});
  }
}); 

webapp.get('/api/leaders/:n', async(req, res) => {
  const results = await lib.getLeaders(db, req.params.n);
  res.status(200).json({ data: results });
})

// Root endpoint
webapp.get('*', (_req, res) => {
  res.sendFile(path.join(_dirname, './clint/build/index.html'));
});

// Default response for any other request
webapp.use((_req, res) => {
  res.status(404);
});

module.exports = webapp; // for testing
