//Games file for most of logic!
//Mongoose functions
let mongoose = require('mongoose')
let Games = mongoose.model('Games')

//TODO:Need to log all errors

let getAllGames = function(req, res){
  //Return the ids of all public game
  return Games.find({})
    .then(foundList => {
      res.send(foundList)})
    .catch(err => {
      res.send(err)
    })
}

let createGame = function(req, res){
  //Create a game on the server, and return its id
  console.log(req.body.Game_ID);

//Mongoose API isn't liking promises...
  return Games.create({
    "Game_ID":req.body.Game_ID,
  }, function(err, GameCreated){
    if(err) {
      console.error(err)
      res.send(err)
    }
    else {
      console.log(GameCreated);
    }
  })
}

let getGameWithID = function(req, res){
  //Gets the information on the game with the specified id
  Games.findById(req.params.gameID)
    .then(res.json)
    .catch(res.send)
}

let updateGameWithID = function(req, res){
  //Updates the status of the game.
  //This is used to start the game, or maybe if we were matchmaking,
  //we could use this to switch which player's turn it is, and only
  //allow a player with that id to move

}

//Deletes the game with the specified id
let deleteGameWithID = function(req, res){
  Games.remove({id:req.params.gameID})
    .then(res.json)
    .catch(res.send)
}

//Get the status of the board at position boardX, boardY
let getStatusOfBoardPos = function(req, res){
  Games.findByID(req.params.gameID).then(game => {
    // let board = game.Game_Board
    //
    // //Check user inputs...
    // let piece = board[req.params.boardX][req.params.boardY]
    return res.json("piece")
  })
    .catch(res.send)
}

//Places a dot at the board position specified on the game specified
let placeDot = function(req, res){
  //Use put somehow?
}


module.exports =
  {
    getAllGames,
    createGame,
    getGameWithID,
    updateGameWithID,
    deleteGameWithID,
    getStatusOfBoardPos,
    placeDot
  }
