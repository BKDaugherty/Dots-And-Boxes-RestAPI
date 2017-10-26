//src/api/controllers/games.js
//Controllers for the API input and ouptut

/////////////CONSTANTS AND REQUIREMENTS/////////////

//Mongoose is used for interfacing with MongoDB
const mongoose = require('mongoose')
const Games = mongoose.model('Games')   //Model for Game data structure

//Used to access code specific to the game, that will be shared between
//client and server for consistency in states.
const gameLogic = require('../../game/gameLogic')

//Used for utility functions that are better housed in another file
const util = require('./utility')

//Keeping board sizes constant for simplicity's sake.
const BOARD_SIZE = 4

//Set this environment variable to log messages to the console
const LOG_MODE = process.env.LOG_MODE
///////////////////////////////////////////////////////////////

//Return the structure for all public games on the server
const getAllGames = function(req, res){
  return Games.find({})
    .then(foundList => {
      if(LOG_MODE)
        console.log("Access to all games successful")
      res.json(util.createSuccessObject(foundList, "200 OK"))})
    .catch(err => {
      if(LOG_MODE)
        console.log("Unable to find games")
      res.send(err)
    })
}

//Create a game on the server, and return its id
const createGame = function(req, res){
  return Games.create({"Game_Board":gameLogic.allocateGameBoard(BOARD_SIZE)}
  , function(err, GameCreated){
    if(err) {
      if(LOG_MODE)
        console.error(err)
      res.send(err)
    }
    else {
      //Return the game's id to the user
      if(LOG_MODE)
        console.log("Game Created with ID:" + GameCreated._id)

      const messageData = {
        "Game_ID":GameCreated._id,
      }
      res.json(util.createSuccessObject(messageData, "201 Created"));
    }
  })
}

//Gets the game board of the game with the specified id in url
const getGameWithID = function(req, res){
  Games.findById(req.params.gameID, function(err, data){
    if(err) {
      if(LOG_MODE)
        console.log(`Something went wrong with the database connection for getGameWithID${req.params.gameID})`)
      res.send(err)
    }
    else {
      //Mongoose does not throw an error if find
      //finds nothing, as it is a query. Need to do
      //our own error handling
      if(data === null){
        if(LOG_MODE)
          console.log("Invalid id: " + req.params.gameID)
        return res.status(404).json({code:404, error:"Resource does not exist"})
      }

      //Override Mongoose display of data for cleaner output
      const message = {
        Game_ID:data._id,
        Game_Board:data.Game_Board,
        Game_Status:data.Game_Status
      }

      if(LOG_MODE)
        console.log("Access to game" + req.params.gameID + "successful")

      res.status(200).json(util.createSuccessObject(message, "200 OK"))
    }
  })
}

//Put request as defined in RFC should replace whatever content is housed
//in specified id. In a larger application we might think that this is
//a security issue, as someone could replace your game; however, in this
//application we are not worried about such issues.
const replaceGameWithID = function(req, res){
  return Games.create({_id:req.params.gameID, Game_Board:req.body.Game_Board})
    .then(gameCreated => {
      if(LOG_MODE)
        console.log("Successful update on id: " + gameCreated._id)

      const messageData = {
        "Game_ID":gameCreated._id,
      }

      res.status(201).json(util.createSuccessObject(messageData, "201 Created"))
    }).catch(err => {

      res.status(400).send("Unable to create game" + err)
    })

}

//Deletes the game with the specified id
const deleteGameWithID = function(req, res){
  return Games.remove({_id:req.params.gameID}, function(err, data){
    if(err) res.send(err)
    else {
      if(LOG_MODE)
        console.log("Game with id " + req.params.gameID + " was successfully deleted.")
      res.sendStatus(204)
    }
  })

}

//Get the edge status at the edge specified in the query
const getStatusOfEdge = function(req, res){

  if(!util.validateInputCheckEdge(req.query.x1, req.query.x2, req.query.y1, req.query.y2, BOARD_SIZE)){
    if(LOG_MODE)
      console.log("Invalid input get status of edge")
    return res.status(400).json({code:400, error:"Invalid input parameters"})
  }

  return Games.findById(req.params.gameID).then(game => {

    const coordFrom = {
      x:req.query.x1,
      y:req.query.y1
    }

    const coordTo = {
      x:req.query.x2,
      y:req.query.y2
    }

    //Returns the owner of the edge
    const edgeData = gameLogic.checkEdge(game.Game_Board, coordFrom, coordTo)

    //If the edge specified is invalid, then we need to return an error
    if(edgeData){
      let message = {
        taken: (edgeData !== "."),
        edgeOwner: (edgeData === ".") ? null : edgeData
      }

      if(LOG_MODE)
        console.log(`Edge: ((${coordFrom.x},${coordFrom.y}), (${coordTo.x}, ${coordTo.y}) is found to have edge data ${edgeData}`)

      res.status(200).json(util.createSuccessObject(message))
    } else {
      //Log error!
      if(LOG_MODE)
        console.log(`Unable to find the requested edge: ((${coordFrom.x},${coordFrom.y}), (${coordTo.x}, ${coordTo.y})`)
      res.status(400).send("Could not find the specified edge")

    }
  }).catch(err => {
    if(LOG_MODE)
      console.log("Caught error in getStatusOfEdge", err)
    res.status(400).send(err)
  })
}

//Places a dot at the board position specified on the game specified
const placeEdge = function(req, res){
  if(!util.validateInputPlaceEdge(req.body.x1, req.body.x2, req.body.y1, req.body.y2, req.body.color, BOARD_SIZE))
    {
      if(LOG_MODE)
        console.log("Invalid input for place edge")
      return res.status(400).json({code:400, error:"Invalid input parameters"})
  }

  const coord1 = {x:req.body.x1, y:req.body.y1}
  const coord2 = {x:req.body.x2, y:req.body.y2}
  const color = req.body.color

  return Games.findById(req.params.gameID).then(game => {
    if(game === null){
      if(LOG_MODE)
        console.log("Unable to find game with" + req.params.gameID)
      return res.status(400).send("ERROR")
    } else {


      const newBoard = gameLogic.placeEdge(game.Game_Board, coord1, coord2, color)

      if(newBoard){

        return Games.update({_id:req.params.gameID}, {$set: {Game_Board:newBoard}})
        .then(data => {
          if(LOG_MODE)
            console.log(`Successful edge placement by ${color} on ${game._id} on ((${coord1.x},${coord1.y}), (${coord2.x}, ${coord2.y})`)
          return res.status(201).json(util.createSuccessObject({message:"Edge created"}, "201 Created"))
        })
        .catch(err => {
          if(LOG_MODE)
            console.log("Unable to save the updated GameBoard")//console.log(err)
          return res.status(400).send(err)
        })
      } else {
        if(LOG_MODE)
          console.log("Unbale to construct modified board")
        return res.status(400).send("Unable to create modified board")
      }
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
