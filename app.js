const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;

// создание базы данных если ее нет
let db = new sqlite3.Database('./games.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the games database.');
});

db.run(`CREATE TABLE IF NOT EXISTS games (
    name TEXT UNIQUE,
    visits INTEGER
)`);

app.use(express.static(path.join(__dirname, '/'))); // для отдачи статических файлов

app.get('/visit/:game', (req, res) => {
  let game = req.params.game;
  db.get("SELECT visits FROM games WHERE name = ?", [game], function(err, row){
    if (err) {
      return console.error(err.message);
    }
    if (row) {
      db.run("UPDATE games SET visits = visits + 1 WHERE name = ?", [game], function(err){
        if (err) {
          return console.error(err.message);
        }
      });
    } else {
      db.run("INSERT INTO games(name, visits) VALUES(?, 1)", [game], function(err){
        if (err) {
          return console.error(err.message);
        }
      });
    }
  });
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
