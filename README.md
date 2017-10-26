# Dots-And-Boxes-RestAPI
A Rest API for the game Dots and Boxes. Built in NodeJS with Express and Mongoose for my Unity Code Test!

## Introduction
If you've never played a game of Dots and Boxes on the back of a menu with two broken crayons, you
haven't lived. Thus, in the spirit of REST, I have built a REST API to do just that, without the inconvenience
of a dull crayon. The rules of the game are simple. Each player takes turns connecting two adjacent (no
diagonals) dots until there are no more edges to draw. If the player, by drawing an edge,
completes a square on the field, he/she claims that square, writing his/her initial in the square, and plays
again. Play continues until there are no more squares to claim. When all squares have been claimed, the player
with the least amount of squares must buy the player with the most amount of squares dinner.

Below is a quick diagram of how the game works on paper, pulled from wikipedia.
![Game Diagram](https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Dots-and-boxes.svg/1200px-Dots-and-boxes.svg.png)


## REST Endpoints

### Games
The endpoints for this REST API have all been grouped into one central route. Were I to make an expansion upon this API, I might diversify this effort. However, for the task at hand, one base route seemed to make the most sense.

#### /games
GET baseURL/games -> Returns all of the games currently hosted on the server.

POST baseURL/games -> Creates a game. Upon a successful creation, this method returns the unique identifier of the created game on the server.

#### /games/:gameID
Each game on the server is given a *unique* identifier, which here is included in the URL of the REST request.

GET /games/:gameID -> Returns the details of the game with the specified gameID, as specified in the data schema.

PUT /games/:gameID -> Places the game specified in the body into the URI specified by gameID on the server.

DELETE /games/:gameID -> Deletes the game with the given gameID from the server.

#### /games/:gameID/board
Using X and Y coordinates, we can specify a specific point on our game board.

GET /games/:gameID/board?x1=&x2=&y1=&y2= -> Returns the status of the board position in question. (Whether it is taken by one of the players or not, and if it is, which player it is occupied by).

POST /games/:gameID/board ->
Adds an edge to the board position specified in the post body

## Data Schema

### Games
The Game model houses two fields: \_id which represents a unique identifier, and the Game_Board, which
is represented as an array of Squares. Each Square is defined in the following fashion.

#### Game Board
The Game Board is an array of 9 Squares, where each square takes the following data format.

| Name        | Description           
| ----------- |:-------------
| num         | The number of the square on the board. Numbered from left to right, top to bottom. (0-8)
| edgeLeft    | The left edge of the square (string ".", "R", "B")
| edgeRight   | The right edge of the square (string ".", "R", "B")
| edgeTop     | The top edge of the square (string ".", "R", "B")
| edgeBottom  | The bottom edge of the square (string ".", "R", "B")
| owner       | The owner of the square (".", "R", "B")
| taken       | The number of taken squares for easy score assessment

#### API Bodies
Some of the endpoints require specific JSON input as a body. Below each of these are defined.

PUT /games/:gameID
This PUT request requires that a game be placed in the body of the request.
A Game has two fields, a board, as described above, and an id, which must match
the following regular expression: /^[0-9a-fA-F]{24}$/

POST /games/:gameID/board
The body of this post request specifies the edge on the board that the player
would like to add, and also must specify the color to use when updating the board.
The data model has been outlined in the following table.

| Name   | Description           
| -------|:-------------
| x1     | The x coordinate of the first point of the edge (Number [0-3])
| x2     | The x coordinate of the second point of the edge (Number [0-3])
| y1     | The y coordinate of the first point of the edge (Number [0-3])
| y2     | The y coordinate of the second point of the edge (Number [0-3])
| color  | The color to place at that edge ("R" || "B")

## Running my project
This project requires a valid installation of both NodeJS and NPM. I used
Node v6.11.0 and npm v5.5.1 in development, so if you can run it with these,
you will probably get the best results.

Before running anything in this project, you need to run npm install from
the root directory. This will install the JavaScript packages that are required.

My API also uses MongoDB, so if you haven't installed that, you can go here
https://docs.mongodb.com/manual/installation/ to get the latest installation.

In my npm scripts, I have assumed that the user will be using a UNIX type operating
system, and have routed the DB output to '/dev/null'. I have also utilized the
environment variable syntax from bash scripting. These scripts will not run on Windows.

### Starting the service
To start the service, you can use 'npm run start', which will launch the REST API
on port 7846. You can also specify the environment variable PORT to run it on a
different port if 7846 is not to your fancy.

### Tests
To run my tests, simply 'run npm run start & npm run test' from the root directory,
as the tests rely on the service being started. After the tests have run, a report
will be generated in the reports directory. Open it with 'open ./reports/DotsAndBoxesTestReport.html'
from the root directory!

## Dependencies

### MongoDB
This project requires that MongoDB be installed on your computer, as all of the
'databasing' is done locally.

### JavaScript Packages
This project relies on the following packages.
* Chai --> Unit and Behavioral testing framework.
* Express --> Used for routing.
* Mocha --> Unit and Behavioral testing framework.
* Mochawesome --> For generating a nice test report.
* Mongoose --> For DB operations with MongoDB.
* Request --> Used as a backbone for Request-Promise.
* Request-Promise --> Used for end to end testing.

## Next Steps
Although this is indeed a REST API, there are plenty of features missing from
a fully scalable REST API. Because this project is built in a small window of time
there are a few key features that I will list here that should be included; however
I did not have time to get to them. This also will act as a TODO list!
* Security
  * Authorization
  Some form of authorization should be required to use the REST API. Currently,
  any user can access the API and delete someone else's game out from under them.
  If we added something such as OAUTH2 authorization, and required each request
  to pass a session token, we could limit this form of security.
  * Cryptography
  Again, in this case our information does not really need to be secure; however, it
  would be a good idea to add some form of cryptography to our API, whether that be in
  the world of a JWT, or using a HTTPS/TLS connection.
  * Helmet
  For the ease of testing, and because of the given time constraint
  I have chosen not to utilize a lot of security functionality.
  However, one option that wouldn't be hard to add, would be the JavaScript package Helmet,
  which works well with express. This would then protect the API from a lot of potential
  HTTP attacks. If I were to push this applet to a production stage, I would at least use Helmet,
  if not other security measures.
  * Sanitization
  In this module, I have supplied some sanitization efforts of my own to ensure that a user
  inputs the right kind of data. However, it might be a good idea to apply a more thorough
  validator if this module goes to production!
* Continuous Integration
Projects are better with continuous integration, and a fully functioning pipeline.
With big projects, continuous integration is absolutely essential. As projects grow,
sometimes new features break old ones. Its important to realize this instantly in the
development cycle, and solve the problem to avoid code regression.
