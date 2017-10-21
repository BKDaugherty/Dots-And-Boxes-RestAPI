//Games file for most of logic!

let getAllGames = function(){
  //Return the ids of all public games
}

let createGame = function(){
  //Create a game on the server, and return its id
}

let getGameWithID = function(){
  //Gets the information on the game with the specified id
}

let updateGameWithID = function(){
  //Updates the status of the game.
  //This is used to start the game, or maybe if we were matchmaking,
  //we could use this to switch which player's turn it is, and only
  //allow a player with that id to move

}

//Deletes the game with the specified id
let deleteGameWithID = function(){

}

//Get the status of the board at position boardX, boardY
let getStatusOfBoardPos = function(){

}

//Places a dot at the board position specified on the game specified
let placeDot = function(){

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
