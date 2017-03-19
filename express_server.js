const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080; // default port 8080
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.set("view engine", "ejs");


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
  let cookieID = req.cookies["user_id"];
  let cookieEmail = users[cookieID].email
  let templateVars = {id:cookieID, email: cookieEmail};
  res.render("urls_index", {templateVars, urlDatabase, users});

});

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });

app.get("/register", (req, res) => {
  res.render("urls_register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/error", (req, res) => {
  res.render("error");
});

// app.post("/urls", (req, res) => {
//   console.log(req.body);
//   res.send(generateRandomString);         // Respond with 'Ok' (we will replace this)
// });

app.post("/create", (req, res) => {
  let cookieID = req.cookies["user_id"];
  let shortURL = generateRandomString();
  let longURL = req.body.addURL;
  let cookieEmail = users[cookieID].email

  urlDatabase[cookieID] = {
    [shortURL]:longURL
  };
  let templateVars = {id:cookieID, email: cookieEmail};
  res.render ("urls_index" , {urlDatabase, templateVars});
});

app.post("/urls/:id/delete", (req, res) => {
  if (urlDatabase[req.params.id]) {
  delete urlDatabase[req.params.id]
  }
  res.redirect("/urls");
});

app.post("/urls/:id/update", (req, res) => {

  let cookieID = req.cookies["user_id"];

  if (urlDatabase[cookieID][req.params.id]) {
  urlDatabase[cookieID][req.params.id] = req.body.longURL
  } else {
    //print error about no website to update info on
  }
  res.redirect("/urls");
});

// app.get("/urls.json", (req, res) => {
//   res.json(urlDatabase);
// });

app.get("/urls/:id/edit", (req, res) => {
//i want the edit page to take the long url and put it inside the edit form.
//info i need to pass to edit page: long url, short url, user id
  let cookieID = req.cookies["user_id"];
  let short_url = req.params.id
  let long_url = urlDatabase[cookieID][short_url]
  let templateVars = { shortURL: short_url, longURL: long_url,
  user: cookieID };
  // console.log(templateVars);
  res.render("urls_show", {templateVars});
});


//below code needs to be refactored to only pull the first key value of the urldatabase, right now it loops through the entire
//object and redirects to the first website URL. kinda messy approach.
app.get("/u/:shortURL", (req, res) => {
  for (let longURL in urlDatabase)
  res.redirect(urlDatabase[longURL]);
});

app.post("/login", (req, res) => {
  let foundEmail = false;
  let foundPass = false;
  let currentID = "";

//reads login email, finds it in the database, matches it to an id and set that id value as a cookie.

  for (userID in users) {

    if (req.body.email === users[userID].email) {
      foundEmail = true;
      currentID = users[userID].id
    }
    if (req.body.password === users[userID].password) {
      foundPass = true;
    }
  }

  if (foundEmail === true && foundPass === true) {
    res.cookie('user_id', currentID);
    res.redirect("/urls");
  } else if (foundEmail === false || foundPass === false) {
    res.redirect("/error");
  }

});


app.post("/urls/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect("/urls");
});



app.post("/register", (req, res) => {

  if ( req.body.email.length > 0 && req.body.password.length > 0) {
    let foundEmail = false;
    let foundPass = false;
    let currentID = "";

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
            password: req.body.password
          }
      users[userID] = userInfo;
      res.cookie('user_id', userID);
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

// have every page check if there is a cookie with all 3 keys present, if not, have a link to log in on the page
//make error for invalid password entry
//make error for existing email





