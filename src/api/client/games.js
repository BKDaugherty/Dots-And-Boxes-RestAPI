//Wrapper client framework for interacting with the API
//Used primarily for testing services
//If this project is expanded, it could be used as a client side
//javascript api to interact with the service!

//Used for HTTP requests
const request = require('request-promise')
const port = process.env.port || 7438
const baseURL = "localhost:" + port.toString()

const getGames = function(){
  return request.get(baseURL + '/games')
}

const createGame = function(){
  return request.post(baseURL + '/games')
}

const getGameWithID = function(gameID){
  return request.get(baseURL + '/games/' + gameID.toString())

}

const updateGameWithID = function(gameID, gameStatus){
  return request.put(baseURL)
}

const deleteGameWithID = function(gameID){
  return request.delete(baseURL)
}

const checkEdge = function(gameID, coord1, coord2){
  return request.get(baseURL + '/games/' + gameID.toString() + `/x1=${coord1.x1}&x2=${coord2.x2}&y1=${coord1.y1}&y2=${coord2.y2}`)
}

const placeEdge = function(gameID, coord1, coord2, color){
  return request.put(baseURL)
}

module.exports = {
  getGames,
  createGame,
  getGameWithID,
  updateGameWithID,
  deleteGameWithID,
  checkEdge,
  placeEdge,
}
