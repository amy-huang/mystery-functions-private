const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { Client } = require('pg');

// Initialize database
var tableClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
tableClient.connect();
// Create table for log actions. TODO: check if table exists already, if not, replace
tableClient.query('create table if not exists actions ( userID varchar (255), actionID integer, actionType varchar (255), time timestamp, input varchar (255), output varchar (255), result varchar (255), reason varchar (255) );', (err, res) => {
  tableClient.end();
});

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function storeHandler(req, res) {
  var action = req.body
  var id = req.connection.remoteAddress
  var time = action.time
  // For datetime, use yyy-mm-dd hh:mi:ss formatting

  var client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  });
  client.connect();
  client.query(`insert into actions (userID) values ('test');`, (err, res) => {
    res.send(
      `Received`,
    );
  });

  // if (action.type === "eval_input") {
  //   client.query(`insert into actions (userID, actionID, actionType, time, input) values ('${id}', '${action.when}', '${action.type}', '${time}', '${action.in}');`, (err, res) => {
  //     res.send(
  //       `Received`,
  //     );
  //   });
  // } else if (action.type === "eval_pair") {
  //   client.query(`insert into actions (userID, actionID, actionType, time, input, output, result) values ('${id}', '${action.when}', '${action.type}', '${time}', '${action.in}', '${action.out}', '${action.result}');`, (err, res) => {
  //     res.send(
  //       `Received`,
  //     );
  //   });
  // } else if (action.type === "final_answer") {
  //   client.query(`insert into actions (userID, actionID, actionType, time, reason) values ('${id}', '${action.when}', '${action.type}', '${time}', '${action.reason}');`, (err, res) => {
  //     res.send(
  //       `Received`,
  //     );
  //   });
  // }
  client.end();
}

// Stores info in heroku postgres database
app.post('/api/store', storeHandler);

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));
