//Import the game module
let Games = require('../api/controllers/games.js');

module.exports = function(app){
  app.route('/games')
    .get(Games.getAllGames) //Returns the IDs of the games
    .post(Games.createGame) //Requires Player IDs

  app.route('/games/:gameID')
    .get(Games.getGameWithID) //Returns the state of the game, and the score
    .put(Games.replaceGameWithID) //Requests that the server place the given game board at the URI
    .delete(Games.deleteGameWithID) //Deletes the game from the database

  app.route('/games/:gameID/:boardX/:boardY')
    .get(Games.getStatusOfBoardPos) //Check the status of a certain position
    .post(Games.placeEdge) //Place a piece on the board
}
