//Wrapper client framework for interacting with the API
//Used primarily for testing services
//If this project is expanded, it could be used as a client side
//javascript api to interact with the service!

//Used for HTTP requests
const request = require('request-promise')
const port = process.env.port || 7846
const baseURL = "http://localhost:" + port.toString()

const getGames = function(){
  return request.get(baseURL + '/games')
}

const createGame = function(){
  return request.post(baseURL + '/games')
}

const getGameWithID = function(gameID){
  return request.get(baseURL + `/games/${gameID}`)

}

const replaceGameWithID = function(gameID, game){
  console.log(gameID)
  return request.put({url:baseURL + `/games/${gameID}`, json:game})
}

const deleteGameWithID = function(gameID){
  return request.delete(baseURL + `/games/${gameID}`)
}

const checkEdge = function(gameID, coord1, coord2){
  return request.get(baseURL + `/games/${gameID}/board?x1=${coord1.x1}&x2=${coord2.x2}&y1=${coord1.y1}&y2=${coord2.y2}`)
}

const placeEdge = function(gameID, coord1, coord2, color){
  const requestBody = {
    x1:coord1.x,
    y1:coord1.y,
    x2:coord2.x,
    y2:coord2.y,
    color:color
  }

  return request.post({url:baseURL + `/games/${gameID}/board`, json:requestBody})
}

module.exports = {
  getGames,
  createGame,
  getGameWithID,
  replaceGameWithID,
  deleteGameWithID,
  checkEdge,
  placeEdge,
}
