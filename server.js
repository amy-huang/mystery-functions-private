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

function storeHandler(req, res) {
  var action = JSON.parse(req.body)
  var id = req.connection.remoteAddress
  var time = action.time
  // For datetime, use yyy-mm-dd hh:mi:ss formatting

  // pool.query(`insert into actions (userID) values ('test');`, (err, result) => {
  //   res.status(201).json({ status: 'success', message: 'test row inserted.' })
  // });

  console.log(action)
  console.log(action.key)
  console.log(action.in)
  console.log(time)
  console.log(id)

  if (action.type === "eval_input") {
    pool.query(`insert into actions (userID, actionID, actionType, time, input) values ('$1', '$2', '$3', '$4', '$5');`, [id, action.key, time, action.in], (err, res) => {
      res.status(201).json({ status: 'success', message: 'eval_input row inserted' })
    });
  } else if (action.type === "eval_pair") {
    pool.query(`insert into actions (userID, actionID, actionType, time, input, output, result) values ('${id}', '${action.when}', '${action.type}', '${time}', '${action.in}', '${action.out}', '${action.result}');`, (err, res) => {
      res.status(201).json({ status: 'success', message: 'eval_pair row inserted' })
    });
  } else if (action.type === "final_answer") {
    pool.query(`insert into actions (userID, actionID, actionType, time, reason) values ('${id}', '${action.when}', '${action.type}', '${time}', '${action.reason}');`, (err, res) => {
      res.status(201).json({ status: 'success', message: 'final_answer row inserted' })
    });
  }
}

app.listen(port, () => console.log(`Listening on port ${port}`));
