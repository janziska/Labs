/**
 * Created by user on 23/10/2016.
 */
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var url = 'mongodb://CS5551_Team1:CS5551_Team1@ds015760.mlab.com:15760/lab10';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/register', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.status(500);
            res.write("Error 1 - Failed, Error while connecting to Database");
            res.end();
        }
        db.collection('test').findOne({"email": req.body.email}, function(error, myDoc) {
            if (error) {
                res.status(500);
                res.write("Error 7 - Database access error, please try again");
                console.log("Error 7 - Database access error, please try again");
                res.end();
            }
            if (myDoc){
                res.status(400);
                res.write("Error 8 - Email already registered");
                console.log("Error 8 - Email already registered");
                res.end();
            }
            else
            {
                db.collection('test').insertOne(req.body, function(err, result) {
                    if(err)
                    {
                        res.status(400);
                        res.write("Registration Failed, Error While Registering");
                        console.log("Registration Failed, Error While Registering");
                        res.end();
                    }
                    console.log("Inserted a document into the restaurants collection.");
                   res.write("Inserted a document into the restaurants collection.");
                    res.end();
                });
            }
        });
    });
})

app.post('/login', function (req, res) {

    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.status(500);
            res.write("Error 2 - Failed, Error while connecting to Database");
            console.log("Error 2 - Failed, Error while connecting to Database");
            res.end();
        }


        db.collection('test').findOne({"email": req.body.email, "password": req.body.password}, function(error, myDoc) {
            if (error) {
                res.status(500);
                res.write("Error 3 - Database access error, please try again");
                console.log("Error 3 - Database access error, please try again");
                res.end();
            }
            if (myDoc){
                var result = {'response' : {'email' : myDoc.email, 'fname' : myDoc.fname,  'lname' : myDoc.fname}};
                res.contentType('application/json');
                console.log(JSON.stringify(result));
                res.write(JSON.stringify(result));
                res.end();
            }
            else
            {
                res.status(400);
                res.write("Error 4 - Incorrect Login, please try again");
                console.log("Error 4 - Incorrect Login, please try again");
                res.end();
            }
        });

    });

})



var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})