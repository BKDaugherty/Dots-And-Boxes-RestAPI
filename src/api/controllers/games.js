//Controllers for the API input and ouptut
const mongoose = require('mongoose')
const gameLogic = require('../../game/gameLogic')
const util = require('./utility')
const Games = mongoose.model('Games')

const BOARD_SIZE = 4

//TODO:Need to log all errors
const DEBUG_MODE = process.env.DEBUG_MODE || true //Debug mode can be set by environment variable

const getAllGames = function(req, res){
  //Return the ids of all public game
  return Games.find({})
    .then(foundList => {
      res.json(util.createSuccessObject(foundList, "200 OK"))})
    .catch(err => {
      res.send(err)
    })
}


const createGame = function(req, res){
  //Create a game on the server, and return its id
  return Games.create({"Game_Board":gameLogic.allocateGameBoard(BOARD_SIZE)}
  , function(err, GameCreated){
    if(err) {
      console.error(err)
      res.send(err)
    }
    else {
      //Return the game's id to the user
      //For querying
      const messageData = {
        "Game_ID":GameCreated._id,
      }
      res.json(util.createSuccessObject(messageData, "201 Created"));
    }
  })
}

const getGameWithID = function(req, res){
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

      //I don't like the way mongoose displays
      //data, so we are overriding it here!

      const message = {
        Game_ID:data._id,
        Game_Board:data.Game_Board,
        Game_Status:data.Game_Status
      }

      res.status(200).json(util.createSuccessObject(message, "200 OK"))
    }
  })
}

const replaceGameWithID = function(req, res){
  //Updates the status of the game.
  //This is used to start the game, or maybe if we were matchmaking,
  //we could use this to switch which player's turn it is, and only
  //allow a player with that id to move

}

//Deletes the game with the specified id
const deleteGameWithID = function(req, res){
  Games.remove({_id:req.params.gameID}, function(err, data){
    if(err) res.send(err)
    else res.sendStatus(204)
  })

}

//Get the status of the board at position boardX, boardY
const getStatusOfEdge = function(req, res){
  Games.findById(req.params.gameID).then(game => {

    const coordFrom = {
      x:req.query.x1,
      y:req.query.y1
    }

    const coordTo = {
      x:req.query.x2,
      y:req.query.y2
    }

    //Returns the owner of the edge
    const edgeData = gameLogic.checkEdge(game.Game_Board)

    //If the edge specified is invalid, then we need to return an error
    if(edgeData){
      let message = {
        taken: (edgeData !== "."),
        edgeOwner: (edgeData === ".") ? null : edgeData
      }
      res.status(200).json(util.createSuccessObject(message))
    } else {
      //Log error!

    }
  }).catch(res.send)
}

//Places a dot at the board position specified on the game specified
const placeEdge = function(req, res){
  const coord1 = {x:req.body.x1, y:req.body.y1}
  const coord2 = {x:req.body.x2, y:req.body.y2}
  const color = req.body.color

  Games.findById(req.params.gameID).then(game => {
    if(game === null){
      if(DEBUG_MODE)
        console.log("Attempt to place edge on invalid game")
      //ERROR HERE
    } else {
      //
      const oldBoard = game.Game_Board
      const newBoard = gameLogic.placeEdge(oldBoard, coord1, coord2, color)

      game.Game_Board = newBoard
      game.save().then(() => {
        if(DEBUG_MODE)
          console.log("Successfully placed edge")
        res.sendStatus(201)
      }).catch(err => {
        console.log(err)
      })


    }
  })


}


module.exports =
  {
    getAllGames,
    createGame,
    getGameWithID,
    replaceGameWithID,
    deleteGameWithID,
    getStatusOfEdge,
    placeEdge
  }
