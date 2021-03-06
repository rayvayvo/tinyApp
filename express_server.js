const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cookieSession = require('cookie-session');

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["user_ids"],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

var urlDatabase = {
  "userID" : {
    "b2xVn2": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
  }
};
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}


app.get("/urls", function(req, res) {
  let cookieID = req.session.user_id;

  if (users[cookieID]) {
    let cookieEmail = users[cookieID].email
    let templateVars = {id:cookieID, email: cookieEmail};
    res.render("urls_index", {templateVars, urlDatabase, users});
  } else {
    res.render("home");
  }
});

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.post("/create", (req, res) => {
  let cookieID = req.session.user_id;
  let shortURL = generateRandomString();
  let longURL = req.body.addURL;

  if (urlDatabase[cookieID]) {
    urlDatabase[cookieID][shortURL] = longURL;
  } else {
    urlDatabase[cookieID] = {[shortURL]:longURL};
  }
  res.redirect("/urls");
});

app.post("/urls/:id/delete", (req, res) => {

  let cookieID = req.session.user_id;
  if (urlDatabase[cookieID][req.params.id]) {
    delete urlDatabase[cookieID][req.params.id]
  }
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {

  let cookieID = req.session.user_id;;
  if (urlDatabase[cookieID][req.params.id]) {
    urlDatabase[cookieID][req.params.id] = req.body.longURL
  } else {
    //print error about no website to update info on
  }
  res.redirect("/urls");
});

app.get("/urls/:id/edit", (req, res) => {
//i want the edit page to take the long url and put it inside the edit form.
//info i need to pass to edit page: long url, short url, user id
  let cookieID = req.session.user_id;
  let short_url = req.params.id
  let long_url = urlDatabase[cookieID][short_url]
  let templateVars = { shortURL: short_url, longURL: long_url,
  user: cookieID };
  res.render("urls_show", {templateVars});
});

app.get("/urls/:id/", (req, res) => {
//when the id page is reached, go to the matching id's long URL info.
//scroll through the URL database to find the id
  let short_url = req.params.id

  for (let userID in urlDatabase) {
    if (urlDatabase[userID][[short_url]]) {
        res.redirect(urlDatabase[userID][[short_url]]);
      }
    }
  res.render("/urls");
});

app.post("/login", (req, res) => {
  let foundEmail = false;
  let foundPass = false;
  let currentID = "";
  const password = req.body.password;
  const hashed_password = bcrypt.hashSync(password, 10);

//reads login email, finds it in the database, matches it to an id.

  for (userID in users) {
    if (req.body.email === users[userID].email) {
        foundEmail = true;
        currentID = users[userID].id
      if (bcrypt.compareSync(req.body.password, users[userID].password) === true) {
        foundPass = true;
      }
    }
  }
  if (foundEmail === true && foundPass === true) {
    req.session.user_id = currentID;
    res.redirect("/urls");
  } else if (foundEmail === false || foundPass === false) {
    res.redirect("/error");
  }

});


app.post("/urls/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});



app.post("/register", (req, res) => {

  if ( req.body.email.length > 0 && req.body.password.length > 0) {
    let foundEmail = false;
    const password = req.body.password; // you will probably this from req.params
    const hashed_password = bcrypt.hashSync(password, 10);

    for (userID in users) {

      if (req.body.email === users[userID].email) {
        foundEmail = true;
      }
    }

    if (foundEmail === true) {
      res.redirect("/error");
    } else {
        let userID = (Math.random() + 1).toString(36).slice(2, 8);
        let userInfo = {
            id: userID,
            email: req.body.email,
            password: hashed_password
          }
      users[userID] = userInfo;

      req.session.user_id = userID
      console.log(req.session.user_id + "ID HURR");
      res.redirect("/urls");

    }
  } else {
      res.redirect("/error");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


//function that generates 6 random characters and sets it as the short URL

function generateRandomString() {
var changeLetter = ""

    changeLetter = (Math.random() + 1).toString(36).slice(2, 8);
return changeLetter;
}






