//Wrapper client framework for interacting with the API
//Used primarily for testing services

//Used for HTTP requests
let request = require('request-promise')
let port = process.env.port || 7438
let baseURL = "localhost:" + port.toString()



let getGames = function(){
  request.get(baseURL)
    .then(json => {

    }).catch(err => {

    });
}

let createGame = function(){
  request.post(baseURL)
    .then(json => {

    }).catch(err => {

    });
}

let getGameWithID = function(){
  request.get(baseURL)
    .then(json => {

    }).catch(err => {

    });
}

let updateGameWithID = function(){
  request.put(baseURL)
    .then(json => {

    }).catch(err => {

    });
}

let deleteGameWithID = function(){
  request.delete(baseURL)
    .then(json => {

    }).catch(err => {

    });
}

let getStatusOfBoardPos = function(){
  request.get(baseURL)
    .then(json => {

    }).catch(err => {

    });
}

let placeDot = function(){
  request.put(baseURL)
    .then(json => {

    }).catch(err => {

    });
}
