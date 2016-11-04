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

// Relative path to image foler
app.use(express.static(path.join(__dirname, 'img')));



// Logging to a file
var log = require('simple-node-logger').createSimpleLogger('./logs/lab9.log');
log.info('log started');
  
// Get rid of CORS Error
app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });

// Translation of Last Image Sent (for testing purposes)
app.get('/getTran', function (req, res) {
  // Backup of image, allows user to retreive last message sent
var filetest = require('fs').readFileSync('./img/test1.jpg').toString('base64');
    // Results  
    var result;
    var resultSent;
    var resultType;
    
    // Test read parameters
    var source = req.param('source');
    var target = req.param('target');
    console.log('info',"Source = " + source);  
    console.log("Target = " + target);
    log.info('info',"Source = " + source);  
    log.info("Target = " + target);
    
    // Body to send Image to Google Clour
    var body = {
      requests: {
        image: {
          content: filetest
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
            log.info('Invalid Status Code Returned from Google Cloud:', response.statusCode)
            return console.log('Invalid Status Code Returned from Google Cloud:', response.statusCode);
        }
      
       // Get description
        console.log(JSON.parse(body).responses[0].textAnnotations[0].description);
        log.info(JSON.parse(body).responses[0].textAnnotations[0].description)
        var desc = JSON.parse(body).responses[0].textAnnotations[0].description;
       
        
    // Translate URL
    var url2 = "https://www.googleapis.com/language/translate/" 
				+ "v2?key=AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM" + "&source=" 
				+ source + "&target=" + target + "&q=" + desc;

    console.log(url2);
        
    // Request to Alchemy
    request2(
     url2, function (error, response, body)  {
         
        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned from Google Translate:', response.statusCode);
        }
         
        // Log results 
        console.log(body);
        log.info(body);
        var translatedText = JSON.parse(body).data.translations[0].translatedText;
        // Send user a response
        result = {'text' : desc, 'translatedText' : translatedText};
         res.status(200);
        res.contentType('application/json');
        res.write(JSON.stringify(result));
      
        res.end();
    })
        
        

    });


})

// Post an image and get the translation
app.post('/photo', function(req, res){
// Backup of image, allows user to retreive last message sent



  // create an incoming form object
  var form = new formidable.IncomingForm();
  var result;
    var resultSent;
    var resultType;
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/img');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, 'test1.jpg'));
    log.info(file.name);
    console.log(file.name);
   
  });

  // log any errors that occur
  form.on('error', function(err) {
    log.info('An error has occured: \n' + err);
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
        // Results  
  
    
    // Read the paramteres for languages
    var source = req.param('source');
    var target = req.param('target');
    log.info("Source = " + source + '\n');  
    log.info("Target = " + target + '\n');

    console.log("Source = " + source);  
    console.log("Target = " + target);
    var filetest = require('fs').readFileSync('./img/test1.jpg').toString('base64');
    // Body to send Image to Google Vision
    var body = {
      requests: {
        image: {
          content: filetest
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults: 10
          }
        ]
      }
    }
    
    // Google Vision URL
    var url = 'https://vision.googleapis.com/v1/images:annotate\?key\=AIzaSyC_7ckfqhJSox1Ay7MLwaxGAx6J-n7MQl0'
    
    // Request to Google
    request({
      url: url,
      method: 'POST',
      body: JSON.stringify(body)
    }, function (error, response, body)  {

         // Check for error
        if(error){
            log.info('Error:', error);
            return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
          log.info('Invalid Status Code Returned from Google Cloud:', response.statusCode);
            return console.log('Invalid Status Code Returned from Google Cloud:', response.statusCode);
        }
      
       // Get description
        console.log(JSON.parse(body).responses[0].textAnnotations[0].description)
        var desc = JSON.parse(body).responses[0].textAnnotations[0].description;
       
        
    // Google Translate URL
    var url2 = "https://www.googleapis.com/language/translate/" 
				+ "v2?key=AIzaSyCvMpcuLjolygMmSkHIIHIgnkq-10yIEXM" + "&source=" 
				+ source + "&target=" + target + "&q=" + desc;

    console.log(url2);
        
    // Request to Translate
    request2(
     url2, function (error, response, body)  {
         
        //Check for right status code
        if(response.statusCode !== 200){
          log.info('Invalid Status Code Returned from Google Translate:', response.statusCode);
            return console.log('Invalid Status Code Returned from Google Translate:', response.statusCode);
        }
         
        // Log results 
        log.info(body);
        console.log(body);
         var translatedText = JSON.parse(body).data.translations[0].translatedText;

        // Build the user user a response in JSON format
         result = {'response' : {'originalText' : desc, 'translatedText' : translatedText}};
         log.info(result);
         console.log(result);
         
         // Send the response
         res.status(200);
        res.contentType('application/json');
        res.write(JSON.stringify(result));
       
        res.end();
    })
        
        

    });

    //res.end('success');
  });

  // parse the incoming request containing the form data
  form.parse(req);

});
var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})