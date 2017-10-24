//The end to end tests for the API
//const Games = require('./games.js')
const expect = require('chai').expect
const mocha = require('mocha')
const dummyClient = require('../api/client/games')

//To run end to end tests we need to initialize the service first!
describe('End to end tests for endpoints', function(){
  describe('/games', function(){
    describe('GET', function(){
      it("Should get all games", function(){
        return dummyClient.getAllGames()
      })
    })
    describe('POST', function(){

    })
  })
  describe('/games/:gameID', function(){
    describe('GET', function(){

    })
    describe('PUT', function(){

    })
    describe('DELETE', function(){

    })
  })
  describe('/games/:gameID/:boardX/:boardY', function(){
    describe('GET', function(){

    })
    describe('PUT', function(){

    })
  })
})
