    // var changeLetter = "hfdajfoo"
  console.log(generateRandomString());


function generateRandomString() {
var changeLetter = ""

// for (var i = 0; i < 6; i++) {
    changeLetter = (Math.random() + 1).toString(36).slice(0, 8);
return changeLetter;

}

