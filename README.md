# Dots-And-Boxes-RestAPI
A Rest API for the game Dots and Boxes. Built in NodeJS with Express and Mongoose for my Unity Code Test!

## REST Endpoints

### Games
The endpoints for this REST API have all been grouped into one central route. Were I to make an expansion upon this API, I might diversify this effort. However, for the task at hand, one base route seemed to make the most sense as a design decision.

#### /games
GET baseURL/games -> Returns the ID's of all games currently on the server.

POST baseURL/games -> Creates a game based on the JSON input established in the data schema. (link to schema) Upon a successful creation, this method returns the unique identifier of the created game on the server.

#### /games/:gameID
Each game on the server is given a *unique* identifier, which here is included in the URL of the REST request.

GET /games/:gameID -> Returns the details of the game with the specified gameID, as specified in the data schema.

PUT /games/:gameID -> Updates the status of the game with the specified gameID. Note: currently, this method is really only used to start the game. However, if we were to extend our game to include a realtime multiplayer aspect, we might add in here some component of which player's turn it is, or if we are waiting for the other player.

DELETE /games/:gameID -> Deletes the game with the given gameID from the server.

#### /games/:gameID/:boardX/:boardY
Using X and Y coordinates, we can specify a specific point on our game board.

GET /games/:gameID/:boardX/:boardY -> Returns the status of the board position in question. (Whether it is taken by one of the players or not, and if it is, which player it is occupied by).

PUT /games/:gameID/:boardX/:boardY ->
Adds a dot to the board position specified on the game with the specified gameID.

## Data Schema

## Successful Response Examples

## Error Response Examples

## Running my project
To run my tests, simply run npm run test from the root directory!

To start the service, you can use npm run start, which will launch the REST API
on port 7846. *(process.env.port || 7846)*
