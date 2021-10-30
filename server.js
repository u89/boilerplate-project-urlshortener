require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const short_urls = [];

function getUniqueId(){
  var val = Math. floor(1000 + Math. random() * 9000);
  return val;
}

function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
app.post('/api/shorturl', 
(req, res, next) => {
  if(!isValidHttpUrl(req.body.url)){
    res.json({"error":"Invalid URL"});
  } else {
    next();
  }
},
(req, res) => {
  let original_url = req.body.url;
  let short_url = getUniqueId().toString();
  while(short_urls[short_url]){
    short_url = getUniqueId().toString();
  }
  short_urls[short_url] = original_url;
  let result = { original_url : original_url, short_url : short_url};
  res.json(result);
});


app.get('/api/shorturl/:id', 
(req, res) => {
  let short_id = req.params.id;
  let short_url = short_urls[short_id];
  if(short_url){
    res.redirect(short_url);
  } else{
    res.status.json({"error":"No short URL found for the given input"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
