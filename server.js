//Boiler plate routing code
let express = require('express'), app = express(), port = process.env.port || 7846

mongoose = require('mongoose'),
  Games = require('./api/models/Game.js'), //created model loading here
  bodyParser = require('body-parser');

//Set up mongoose!
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let routes = require('./api/routes/games.js'); //importing route
routes(app); //register the route

//Start the server
app.listen(port)

//Log the port and that the app has started
console.log("Dots and Boxes started on port " + port);
