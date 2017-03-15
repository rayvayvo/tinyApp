var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

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

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

// app.get("/urls/:id", (req, res) => {
//   let templateVars = { shortURL: req.params.id };
//   res.render("urls_show", {urlDatabase});
// });

app.get("/u/:shortURL", (req, res) => {
  // console.log(urlDatabase);
  for (let longURL in urlDatabase)
    // console.log(urlDatabase[longURL]);
  // let longURL = urlDatabase[0];
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








