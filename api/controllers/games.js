//Games file for most of logic!
//Mongoose functions
let mongoose = require('mongoose')
let Games = mongoose.model('Games')

//TODO:Need to log all errors

//Actual game logic helper functions
const BOARD_SIZE = 4

class Square {
  //Default constructor
  constructor(){
    this.edgeBottom = "."
    this.edgeRight = "."
    this.edgeTop = "."
    this.edgeLeft = "."
    this.taken = 0
    this.owner = "."
  }
  //Used for checking the squares we receive
  //from the database
  populateSquare(squareModel){
    this.edgeBottom = squareModel.edgeBottom
    this.edgeRight = squareModel.edgeRight
    this.edgeTop = squareModel.edgeTop
    this.edgeLeft = squareModel.edgeLeft
    this.taken = 0
    this.owner = squareModel.owner
  }
}

//Creates the squares of the gamebaord
let allocateGameBoard = function(size){
  let gameBoard = []
  //Game Board is a grid of (size - 1) squared grids
  for(let i = 0; i < Math.pow(size-1, 2); i++){
    gameBoard.push(new Square())
  }
  return gameBoard
}

//////////////////////////////////////

//Server code

let createSuccessObject = function(messageData){
  return {
    error:null,
    code:"200",
    data:messageData
  }
}
//Error is a message
let createFailure = function(code, error){
  error
  code
}

let getAllGames = function(req, res){
  //Return the ids of all public game
  return Games.find({})
    .then(foundList => {
      res.json(createeSuccessObject(foundList))})
    .catch(err => {
      res.send(err)
    })
}


let createGame = function(req, res){
  //Create a game on the server, and return its id
  return Games.create({"Game_Board":allocateGameBoard(BOARD_SIZE)}
  , function(err, GameCreated){
    if(err) {
      console.error(err)
      res.send(err)
    }
    else {
      //Return the game's id to the user
      //For querying
      let messageData = {
        "Game_ID":GameCreated._id,
      }
      res.json(createSuccessObject(messageData));
    }
  })
}

let getGameWithID = function(req, res){
  //Gets the information on the game with the specified id
  Games.findById(req.params.gameID, function(err, data){
    if(err) res.send(err)
    else {

      //Mongoose error handling doesn't throw on bad get?
      //TODO:Need to send an error message here!
      if(data === null){
        res.send(err)
        return
      }

      //I don't like the way Mongoose displays
      //data, so we are overriding it here!
      let message = {
        Game_ID:data._id,
        Game_Board:data.Game_Board,
        Game_Status:data.Game_Status
      }

      res.json(createSuccessObject(message))
    }
  })
}

let updateGameWithID = function(req, res){
  //Updates the status of the game.
  //This is used to start the game, or maybe if we were matchmaking,
  //we could use this to switch which player's turn it is, and only
  //allow a player with that id to move

}

//Deletes the game with the specified id
let deleteGameWithID = function(req, res){
  Games.remove({_id:req.params.gameID}, function(err, data){
    if(err) res.send(err)
    else res.json(createSuccessObject("Successfully deleted"))
  })

}

//Get the status of the board at position boardX, boardY
let getStatusOfEdge = function(req, res){
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
let placeEdge = function(req, res){
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
