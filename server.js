//Boiler plate routing code
let express = require('express'), app = express(), port = process.env.port || 7846

//Start the server
app.listen(port)

//Log the port and that the app has started
console.log("Dots and Boxes started on port " + port);
