/**
 * Thanks to https://news.ycombinator.com/item?id=11354454 and diggan and Marmik for the starter code
 */

// Initial apps
var express = require('express');
var app = express();
var request = require('request');
var request2 = require('request');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');


app.use(express.static(path.join(__dirname, 'img')));

// Test file
var file = require('fs').readFileSync('./img/test1.jpg').toString('base64');


app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

// Translation of Image
app.get('/getTran', function (req, res) {
    // Results  
    var result;
    var resultSent;
    var resultType;
    
    // Test read parameters
    var user_id = req.param('source');
    var token = req.param('target');
    console.log("Source = " + source);  
    console.log("Target = " + target);
    
    // Body to send Image to Google Clour
    var body = {
      requests: {
        image: {
          content: file
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults: 10
          }
        ]
      }
    }
    
    // Google URL
    var url = 'https://vision.googleapis.com/v1/images:annotate\?key\=AIzaSyC_7ckfqhJSox1Ay7MLwaxGAx6J-n7MQl0'
    
    // Request to Google
    request({
      url: url,
      method: 'POST',
      body: JSON.stringify(body)
    }, function (error, response, body)  {

         //Check for error
        if(error){
            return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned from Google Cloud:', response.statusCode);
        }
      
       // Get description
        console.log(JSON.parse(body).responses[0].textAnnotations[0].description)
        var desc = JSON.parse(body).responses[0].textAnnotations[0].description;
       
        
    // Alchemy URL
    var url2 = 'http://gateway-a.watsonplatform.net/calls/text/TextGetTextSentiment?apikey=6374c076c0afdefeb93b382ecf5610fb71710307&outputMode=json&text=' + desc;
    console.log(url2);
        
    // Request to Alchemy
    request2(
     url2, function (error, response, body)  {
         
        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned from Alchemy:', response.statusCode);
        }
         
        // Log results 
        console.log(body);
         var typ = JSON.parse(body).docSentiment.type;
        var scre = JSON.parse(body).docSentiment.score;
        // Send user a response
         result = {'text' : desc, 'type' : typ, 'score': scre};
        res.contentType('application/json');
        res.write(JSON.stringify(result));
      
        res.end();
    })
        
        

    });


})

app.post('/photo', function(req, res){

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/img');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, 'test1.jpg'));
      console.log(file.name);
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})