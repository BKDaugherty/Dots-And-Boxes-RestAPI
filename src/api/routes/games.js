//Import the game module
const Games = require('../controllers/games.js');

module.exports = function(app){
  app.route('/games')
    .get(Games.getAllGames) //Returns the IDs of the games on the server
    .post(Games.createGame) //Requires Game Board Parameters

  app.route('/games/:gameID([0-9a-f]{24})')
    .get(Games.getGameWithID) //Returns the state of the game
    .put(Games.replaceGameWithID) //Updates the status of the game, for the game to start
    .delete(Games.deleteGameWithID) //Deletes the game from the database

  app.route('/games/:gameID([0-9a-f]{24})/board')
    .get(Games.getStatusOfEdge) //Check the status of a certain edge
    .post(Games.placeEdge) //Places an edge on the board as specified in post body
}
