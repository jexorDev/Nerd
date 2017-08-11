const express = require('express')
const path = require('path');
const api = require('./routes/api');
//const DocumentDBClient = require('documentdb').DocumentClient;
const mysql = require('mysql');
const bodyParser = require('body-parser');

const collLink = `dbs/nerd-database/colls/nerd-collection`;

const app = express();

app.set('port', (process.env.PORT || 5000));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

var router = express.Router();


router.use(function(req, res, next) {
  console.log('something happend');
  next();
});


app.get('/', function (req, res) {
  res.json('Hello World!')
});

 var connection = mysql.createConnection({
      host : 'dustinsegertest.caleqirppl6q.us-west-2.rds.amazonaws.com',
      database : 'expresstestdb',
      user : 'dustinseger',
      password : 'eugene1204', 
      timeout : 1000, 
      port : 3306
    });



router.route('/bears') 
  .post(function(req, res) {
    console.log('attempting to connect to db');

    connection.connect(function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('connected to db');
      }
    });

    var user = { name : req.body.name };
    var query = connection.query('INSERT INTO users SET ?', user, function(err, result) {
      if (err) {
        throw err;
      }

      console.log(result[0]);
    });


    res.json({result: query.sql});

  })
  .get(function(req, res) {
    
    connection.connect(function(err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('connected to db');
      }
    });

    var query = connection.query('SELECT * FROM users', function(err, result) {
      if (err) {
        throw err;
      }
      res.json(result);
      console.log(result);
    });


    
    /*
    const docdbClient = new DocumentDBClient(
      'https://nerd-sample.documents.azure.com:443/',
      { "masterKey": 'GhP69k6RLb2A8dcEshbGbweSWIW6O0YsCUtMHmPbnAL1Cgfb0I2QhhnjVACskq3fPE93PpkTylJg1ntlHepwsQ==' });

    const querySpec = {
        query: 'SELECT * FROM root r WHERE r.id = @id',
        parameters: [{
          name: '@id',
          value: '0'
        }]
      };
      
      docdbClient.queryDocuments(collLink, querySpec)
        .toArray((err, docs) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          else {
            res.json(docs);
            console.log(docs);  
          }
        });
    */

  });
  


app.use('/api', router);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});