// Requires
const express = require('express');
// const http = require('http');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const RequestMaker = require('./RequestMaker');
// const request = require('request');

// CONSTANTS
// db consts
// const MongoDB = require('mongodb');
// const dbName = 'cloud-project'; // database name
// const dbURL = 'mongodb://localhost:27017/'; // address
// const collectionName = 'UploadedFiles';
// const DBHandler = require('./DBHandler');
// DB Server consts
const dbServerUrl = 'http://localhost:5001/files';
const production_dbServerUrl = '';
const requestMaker = new RequestMaker(fs);

const app = express();
const uploadPath = "uploads/";
const fileSize = 16000; // 16 MB
const uploadFilename = 'upload';
// const client = MongoDB.MongoClient; // client used to connect to the server
// const Binary = MongoDB.Binary; // store files

// consts tsuru
const appNmae = 'node';
const serviceName = 'mongodb';
const serviceInstance = 'mdb';

// middleware
// multer settings - change the uploaded filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

// create upload with defined settings
const upload = multer({
  storage: storage,
  dest: uploadPath,
  limits: {
    fileSize: fileSize
  }
}).single(uploadFilename);

// load the bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// INDEX
// get method
app.get('/', function(req, res){
	  // res.send('Hello world from tsuru');
	res.sendFile(path.join(__dirname+'/index.html'));
});

// RESOURCES
// post method handling the service addition/binding/unbinding etc
app.post('/resources', (req, res) => {
  console.log(req);
  name = req.body.name;
  plan = req.body.plan;
  team = req.body.team;

  res.json({
    "name": name,
    "plan": plan,
    "team": team
  });
  res.status(201).end();
});

//post method binding a service instance
app.post(`/resources/${serviceInstance}/bind`, (req, res) => {
  appHost = req.body['app-host'];
  appName = req.body['app-name']
  console.log(appHost);
  console.log(appName);
});
app.post(`/resources/${serviceInstance}/bind-app`, (req, res) => {
  console.log(`app host: ${req.body['app-host']}`);
  res.status(201).set({
    "Content-Type": "application/json",
    "charset": "UTF-8"
  }).json({
    "MONGODB_URI": "127.0.0.1:27017",
    "MONGODB_PUBLIC_URI": "127.0.0.1:27017",
    "MONGOAPI_DBNAME": "mdb_api"
  }).end();
});

// UPLOAD
// get method - display a file upload form
app.get('/upload', (req, res) => {
	res.sendFile(path.join(__dirname+'/upload.html'));
});

// post method -  handle file upload
app.post('/upload', (req, res, next) => {
  // handle the uploaded file
  upload(req, res, (err) => {
    if (err instanceof(multer.MulterError)) {
      // something went wrong
      console.log(err);

    } else if (req.body['filename'] === '' || req.file === undefined) {
      // if any fields not filled
      console.log('Form not fully filled');

    } else {
      // everything is fine
      console.log(req.body);
      console.log(req.file);
	    console.log(`upload: ${req.file}, filename: ${req.file.filename}, minetype: ${req.file.minetype}`);

      // get the file tyep from original file
      const fileType = req.file.originalname.split(".")[1];
      console.log(fileType);

      // file name
      // const fn = `${uploadPath}${req.body.filename}.${fileType}`;
      const filepath = `${uploadPath}${req.file.filename}`;

      requestMaker.post(dbServerUrl, filepath, uploadFilename);
    }
  });

	res.redirect('/upload')
});

app.listen(() => {
  console.log(`Server started on port ${process.env.PORT}`);
});

const server = app.listen(process.env.PORT || 5000);
