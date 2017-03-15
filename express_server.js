const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");


var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
  //add new short and long url keys
};

app.get("/urls", function(req, res) {
  res.render("urls_index", { urlDatabase });
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // debug statement to see POST parameters
  res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete", (req, res) => {
if (urlDatabase[req.params.id]) {
  delete urlDatabase[req.params.id]
} else {
// print errorr saying id not found
}
res.redirect("/urls");
//   let id = urlDatabase
// delete urlDatabase;
});

app.post("/urls/:id/update", (req, res) => {
  if (urlDatabase[req.params.id]) {
  urlDatabase[req.params.id] = req.body.longURL
  // debugger;
  } else {
    //print error about no website to update info on
  }
  res.redirect("/urls");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls/:id", (req, res) => {
  let short_url = req.params.id
  let long_url = urlDatabase[short_url]
  let templateVars = { shortURL: short_url, longURL: long_url };
  // console.log(templateVars);
  res.render("urls_show", {templateVars});
});


//below code needs to be refactored to only pull the first key value of the urldatabase, right now it loops through the entire
//object and redirects to the first website URL. kinda messy approach.
app.get("/u/:shortURL", (req, res) => {
  for (let longURL in urlDatabase)
  res.redirect(urlDatabase[longURL]);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//make a function that generates 6 random characters and sets it as the short URL
//characters should be alpha-numeric, capitals are fine

function generateRandomString() {
var changeLetter = ""

    changeLetter = (Math.random() + 1).toString(36).slice(0, 8);
return changeLetter;
}








