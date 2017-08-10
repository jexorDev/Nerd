const express = require('express')
const path = require('path');
const api = require('./routes/api');
const DocumentDBClient = require('documentdb').DocumentClient;
const collLink = `dbs/nerd-database/colls/nerd-collection`;

const app = express();

app.set('port', (process.env.PORT || 5000));

var router = express.Router();


router.use(function(req, res, next) {
  console.log('something happend');
  next();
});


app.get('/', function (req, res) {
  res.json('Hello World!')
});


router.route('/bears') 
  .post(function(req, res) {
    res.json({message: 'go bear'})
  })
  .get(function(req, res) {
    
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
  });
  


app.use('/api', router);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});