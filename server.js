const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Client, Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  max: 20,
});
pool.query('create table if not exists actions ( userID varchar (255), actionID integer, actionType varchar (255), time timestamp, input varchar (255), output varchar (255), result varchar (255), reason varchar (255) );', (err, result) => {
});

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: make this generic for any input, output types we use: no special charas
function toDbString(a_list) {
  as_str = ""
  for (var i = 0; i < a_list.length; i++) {
    if (as_str.length > 0) {
      as_str += " "
    }
    as_str += JSON.stringify(a_list[i])
  }
  return as_str
}

// Stores info in heroku postgres database
app.post('/api/store', (req, res) => {
  var action = req.body
  var id = req.connection.remoteAddress
  var time = action.time
  // For datetime, use yyy-mm-dd hh:mi:ss formatting

  // This test query works.
  // pool.query(`insert into actions (userID) values ('test');`, (err, result) => {
  //   res.status(201).json({ status: 'success', message: 'test row inserted.' })
  // });

  console.log("action: ", action)
  console.log("key: ", action.key)
  console.log("in: ", action.in)
  console.log("time: ", time)
  console.log("id: ", id)

  if (action.type === "eval_input") {
    in_str = toDbString(action.in)
    console.log("in str: ", in_str)
    pool.query(`insert into actions (userID, actionID, actionType, time, input) values ('$1', '$2', '$3', '$4', '$5');`, [id, action.key, action.type, time, in_str], (err, result) => {
      if (!err) {
        res.status(201).json({ status: 'success', message: 'final_answer row inserted' })
      }
    });

  } else if (action.type === "eval_pair") {
    in_str = toDbString(action.in)
    out_str = toDbString(action.out)

    pool.query(`insert into actions (userID, actionID, actionType, time, input, output, result) values ('$1', '$2', '$3', '$4', '$5', '$6', '$7');`, [id, action.key, action.type, time, in_str, out_str, action.result], (err, result) => {
      if (!err) {
        res.status(201).json({ status: 'success', message: 'final_answer row inserted' })
      }
    });
  } else if (action.type === "final_answer") {
    pool.query(`insert into actions (userID, actionID, actionType, time, reason) values ('$1', '$2', '$3', '$4');`, [id, action.key, action.type, time, action.reason], (err, result) => {
      if (!err) {
        res.status(201).json({ status: 'success', message: 'final_answer row inserted' })
      }
    });
  }
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
