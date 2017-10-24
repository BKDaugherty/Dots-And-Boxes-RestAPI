//Import the game module
const Games = require('../controllers/games.js');

module.exports = function(app){
  app.route('/games')
    .get(Games.getAllGames) //Returns the IDs of the games
    .post(Games.createGame) //Requires Game Board Parameters

  app.route('/games/:gameID')
    .get(Games.getGameWithID) //Returns the state of the game
    .put(Games.replaceGameWithID) //Updates the status of the game, for the game to start
    .delete(Games.deleteGameWithID) //Deletes the game from the database

  app.route('/games/:gameID/board')
    .get(Games.getStatusOfEdge) //Check the status of a certain edge
    .post(Games.placeEdge)
}
