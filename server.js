var path = require('path');
var fs = require('fs');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var app = express();
var port = process.env.PORT || 3000;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB;
var mongoURL = 'mongodb://' + mongoUser + ':' + mongoPassword +
  '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongoDB;

console.log('== MongoDB URL:', mongoURL);

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.get('/people', function (req, res, next) {

  var collection = mongoDB.collection('people');
  collection.find({}).toArray(function (err, peopleData) {

    if (err) {
      res.status(500).send("Error fetching people from DB.");
    } else {
      var templateArgs = {
        people: peopleData,
        title: "Photos of People"
      };
      res.render('peoplePage', templateArgs);
    }

  });

});

app.get('/people/:person', function (req, res, next) {
  var person = req.params.person;
  var collection = mongoDB.collection('people');
  collection.find( { personid: person }).toArray(function (err, peopleData) {
    if (err) {
      console.log("== Error fetching person (" + req.params.person + ") from database:", err);
      res.status(500).send("Error fetching person from DB.");
    } else if (peopleData.length < 1) {
      next();
    } else {
      var personData = peopleData[0];
      var templateArgs = {
        photos: personData.photos,
        name: personData.name,
        title: "Photos of People - " + personData.name
      }
      res.render('photosPage', templateArgs);
    }
  });

});

app.post('/people/:person/addPhoto', function (req, res, next) {

  if (req.body && req.body.url) {
    var collection = mongoDB.collection('people');
    var photo = {
      url: req.body.url,
      caption: req.body.caption
    };
    collection.updateOne(
      { personid: req.params.person },
      { $push: { photos: photo }},
      function (err, result) {
        if (err) {
          console.log("== Error inserting photo for person (" + req.params.person + ") into database:", err);
          res.status(500).send("Error inserting photo into database: " + err);
        } else {
          res.status(200).send();
        }
      }
    )
  } else {
    res.status(400).send("Person photo must have a URL.");
  }

});

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (req, res) {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Start the server listening on the specified port.
MongoClient.connect(mongoURL, function (err, db) {
  if (err) {
    throw err;
  }
  mongoDB = db;
  app.listen(port, function () {
    console.log("== Server listening on port", port);
  });
});
