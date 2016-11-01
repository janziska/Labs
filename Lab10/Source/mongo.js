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

// Register/insert
app.post('/register', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        // Bad connection
        if(err)
        {
            console.log(req.body);
            res.status(500);
            res.write("Error 1 - Failed, Error while connecting to Database");
            res.end();
        }
        // See if it is in there first
        db.collection('test').findOne({"email": req.body.email}, function(error, myDoc) {
            if (error) {
                res.status(500);
                res.write("Error 7 - Database access error, please try again");
                console.log("Error 7 - Database access error, please try again");
                res.end();
            }

            // Already have that, stop the process
            if (myDoc){
                res.status(400);
                res.write("Error 8 - Email already registered");
                console.log("Error 8 - Email already registered");
                res.end();
            }
            // Clear to insert
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
                    res.status(200);
                    console.log("Inserted a document into the restaurants collection.");
                   res.write("Inserted a document into the restaurants collection.");
                    res.end();
                });
            }
        });
    });
})

app.post('/login', function (req, res) {
    // Connect to dv
    MongoClient.connect(url, function(err, db) {
        if(err)
        {
            res.status(500);
            res.write("Error 2 - Failed, Error while connecting to Database");
            console.log("Error 2 - Failed, Error while connecting to Database");
            res.end();
        }
        
        // Do we have that password, email combo
        db.collection('test').findOne({"email": req.body.email, "password": req.body.password}, function(error, myDoc) {
            // Conection issue
            if (error) {
                res.status(500);
                res.write("Error 3 - Database access error, please try again");
                console.log("Error 3 - Database access error, please try again");
                res.end();
            }
            // got it, clear to login, send back user data 
            if (myDoc){
                res.status(200);
                var result = {'response' : {'email' : myDoc.email, 'fname' : myDoc.fname,  'lname' : myDoc.fname}};
                res.contentType('application/json');
                console.log(JSON.stringify(result));
                res.write(JSON.stringify(result));
                res.end();
            }

            // Nope, not there
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

// Delete
app.post('/delete', function (req, res) {
    console.log(req.body.email);
    MongoClient.connect(url, function(err, db) {
        // Connection error
        if(err)
        {
            res.status(500);
            res.write("Error 9 - Failed, Error while connecting to Database");
            console.log("Error 9 - Failed, Error while connecting to Database");
            res.end();
        }
        // Delete it
        else
        {
            db.collection('test').remove({"email": req.body.email}, function(error, result) {
            // Not there
            if (error) {
                res.status(500);
                res.write("Error 3 - Database access error, please try again");
                console.log("Error 3 - Database access error, please try again");
                res.end();
            }
            // Deleted
            else
            {
                res.status(200);
                res.write("Success - " + result);
                console.log("Success - " + result);
                res.end();
            }
        });
        }
       

    });

})
// Update the user
app.post('/update', function (req, res) {
    MongoClient.connect(url, function(err, db) {
        // Connection error
        if(err)
        {
            res.status(500);
            res.write("Error 13 - Failed, Error while connecting to Database");
            res.end();
        }
        // Make sure it is there
          db.collection('test').findOne({"email": req.body.oldemail}, function(error, myDoc) {
            // Something went wrong
            if (error) {
                res.status(500);
                res.write("Error 7 - Database access error, please try again");
                console.log("Error 7 - Database access error, please try again");
                res.end();
            }
            // Found it, make an update
            if (myDoc){
               db.collection('test').update({"email": req.body.oldemail}, {$set:{"newemail" : req.body.newemail, "fname" : req.body.fname, "lname" : req.body.lname, "password" : req.body.password}},  function(err, result) {
                   // Update error
                    if(err)
                    {
                        res.status(400);
                        res.write("Update Failed, Error While Updating");
                        console.log("Update Failed, Error While Updating");
                        res.end();
                    }

                    // Update worked
                    else{
                        res.status(200);
                        console.log("Updated your info");
                    res.write("Updated your info");
                        res.end();
                    }
                    
                });
            }

            // User does not exist
            else
            {
                res.status(500);
                res.write("Error 15 - User does not exist");
                console.log("Error 15 - User does not exist");
                res.end();

            }
       
          });
     
    });
})

// Server port and address
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})