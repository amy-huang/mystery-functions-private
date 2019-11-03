const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Client, Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// For parsing to DB-friendly strings that are readable and not special characters
const in_out_types = {
  "SumParity": {
    "in": listToDBString,
    "out": justStringify
  },
  "MakePalindrome": {
    "in": listToDBString,
    "out": listToDBString
  }
}

function listToDBString(a_list) {
  if (a_list === undefined) {
    return ""
  }
  already_str = JSON.stringify(a_list)
  if (!already_str.includes("[") && !already_str.includes("]") && !already_str.includes(",")) {
    return already_str
  }

  as_str = ""
  for (var i = 0; i < a_list.length; i++) {
    if (as_str.length > 0) {
      as_str += " "
    }
    as_str += JSON.stringify(a_list[i])
  }
  if (as_str.length === 0) {
    return "empty"
  }
  return as_str
}

function justStringify(obj) {
  already_str = JSON.stringify(a_list)
  if (!already_str.includes("[") && !already_str.includes("]") && !already_str.includes(",")) {
    return already_str
  }
  console.log("Error, stringified obj contains '[]'", obj, already_str)
  return "Error"
}

const conPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
  max: 20,
});
conPool.query('create table if not exists actions (userID VARCHAR (255), fcnName VARCHAR (255), actionID INTEGER, actionType VARCHAR (255), time TIMESTAMP, input VARCHAR (255), output VARCHAR (255), quizQ VARCHAR (255), actualOutput VARCHAR (255), result BOOLEAN, finalGuess VARCHAR (255) );', (err, result) => {
});

// Stores info in heroku postgres database
app.post('/api/store', async (req, res) => {
  var action = req.body
  var id = action.id
  var name = action.fcn
  var key = action.key
  var type = action.type
  var time = action.time

  console.log(typeof id, "id: ", id)
  console.log(typeof name, "name: ", name)
  // console.log(typeof action.key, "key: ", key)
  // console.log(typeof action.key, "type: ", type)
  console.log(typeof action.time, "time: ", time)

  if (type === "eval_input") {
    // TODO: use in_out_types to use the right transformation fcn to db string
    in_str = listToDBString(action.in)
    out_str = listToDBString(action.out)
    console.log("in: ", in_str)
    console.log("in: ", out_str)

    conPool.query(`insert into actions (userID, fcnName, actionID, actionType, time, input, output) values ($1, $2, $3, $4, $5, $6, $7);`, [id, name, key, type, time, in_str, out_str], (err, result) => {
      if (!err) {
        res.send(`Success!`)
      } else {
        res.send(`Failed!`)
      }
    });
  } else if (type === "final_answer") {
    finalGuess = action.finalGuess

    conPool.query(`insert into actions (userID, fcnName, actionID, actionType, time, finalGuess) values ($1, $2, $3, $4, $5, $6);`, [id, name, key, type, time, finalGuess], (err, result) => {
      if (!err) {
        res.send(`Success!`)
      } else {
        res.send(`Failed!`)
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
