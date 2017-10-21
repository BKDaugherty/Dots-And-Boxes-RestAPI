//Import the game module
let Games = require('../controllers/games.js');

module.exports = function(app){
  app.route('/games')
    .get(Games.getAllGames) //Returns the IDs of the games
    .post(Games.createGame) //Requires Game Board Parameters

  app.route('/games/:gameID')
    .get(Games.getGameWithID) //Returns the state of the game, and the score
    .put(Games.updateGameWithID) //Updates the status of the game, for the game to start
    .delete(Games.deleteGameWithID) //Deletes the game from the database

  app.route('/games/:gameID/:boardX/:boardY')
    .get(Games.getStatusOfBoardPos) //Check the status of a certain position
    .put(Games.placeDot) //Place a piece on the board
}
