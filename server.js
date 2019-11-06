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
    "in": listIntOrIntToDBString,
    "out": justStringify
  },
  "MakePalindrome": {
    "in": listIntOrIntToDBString,
    "out": listIntOrIntToDBString
  }
}

// function listIntOrIntToDBString(a_list) {
//   if (a_list === undefined) {
//     return ""
//   }
//   already_str = JSON.stringify(a_list)
//   if (!already_str.includes("[") && !already_str.includes("]") && !already_str.includes(",")) {
//     return already_str
//   }

//   as_str = ""
//   for (var i = 0; i < a_list.length; i++) {
//     if (as_str.length > 0) {
//       as_str += " "
//     }
//     as_str += JSON.stringify(a_list[i])
//   }
//   if (as_str.length === 0) {
//     return "empty"
//   }
//   return as_str
// }

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
conPool.query('create table if not exists actions (userID VARCHAR (255), fcnName VARCHAR (255), actionID INTEGER, actionType VARCHAR (255), time TIMESTAMP, input VARCHAR (255), output VARCHAR (255), quizQ INTEGER, actualOutput VARCHAR (255), result BOOLEAN, finalGuess VARCHAR (255) );', (err, result) => {
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
  console.log(typeof action.key, "key: ", key)
  console.log(typeof action.type, "type: ", type)
  console.log(typeof action.time, "time: ", time)

  if (type === "eval_input") {
    // TODO: move toDBString methods to input type objects
    in_str = listIntOrIntToDBString(action.in)
    out_str = listIntOrIntToDBString(action.out)
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
    console.log("final guess: ", finalGuess)

    conPool.query(`insert into actions (userID, fcnName, actionID, actionType, time, finalGuess) values ($1, $2, $3, $4, $5, $6);`, [id, name, key, type, time, finalGuess], (err, result) => {
      if (!err) {
        res.send(`Success!`)
      } else {
        res.send(`Failed!`)
      }
    });
  } else if (type === "quiz_answer") {
    // TODO: move toDBString methods to input type objects
    in_str = action.in
    out_str = action.out
    actual_str = action.actual
    question = action.q.toString()  // TODO: just make all action fields be strings
    result = action.result.toString()

    console.log("in: ", in_str)
    console.log("out: ", out_str)
    console.log("actual out: ", actual_str)
    console.log("question: ", question)
    console.log("result: ", result)

    conPool.query(`insert into actions (userID, fcnName, actionID, actionType, time, input, output, actualOutput, quizQ, result) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`, [id, name, key, type, time, in_str, out_str, actual_str, question, result], (err, result) => {
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
