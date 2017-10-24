//The end to end / behavioral tests for the API
//const Games = require('./games.js')
const expect = require('chai').expect
const mocha = require('mocha')
const dummyClient = require('../api/client/games')

//To run end to end / behavioral tests we need to initialize the service first!
describe('End to end tests for endpoints', function(){
  describe('/games', function(){
    describe('GET', function(){
      it("Should throw no error", function(){
        return dummyClient.getGames()
      })
      it("Should return 200 OK", function(){
        return dummyClient.getGames().then(message => {
          const messageJSON = JSON.parse(message)
          expect(messageJSON.code).to.equal('200 OK')
          expect(messageJSON.error).to.be.null
        })
      })

    })
    describe('POST', function(){
      let game_id
      it("Should create a game", function(){
        return dummyClient.createGame().then(message => {
          const messageJSON = JSON.parse(message)
          expect(messageJSON.code).to.equal('201 Created')
          expect(messageJSON.error).to.be.null
          expect(messageJSON.data.Game_ID).to.be.ok

          //Cache game_id for access later in cleanup
          game_id = messageJSON.data.Game_ID
        })
      })

      //Clean up environment
      after(function(){
        return dummyClient.deleteGameWithID(game_id)
      })
    })
  })
  describe('/games/:gameID', function(){

    //Create a game and cache the id for later use
    let game_id
    before(function(){
      return dummyClient.createGame().then(message => {
        game_id = JSON.parse(message).data.Game_ID
      })
    })

    describe('GET', function(){
      it("Should return with no errors", function(){
        return dummyClient.getGameWithID(game_id)
      })
      it("Should return a valid game state", function(){
        return dummyClient.getGameWithID(game_id)
        .then(message => {
          const parsedMessage = JSON.parse(message)
          expect(parsedMessage.code).to.equal('200 OK')
          expect(parsedMessage.error).to.be.null
          expect(parsedMessage.data.Game_Board.length).to.equal(9)
          expect(parsedMessage.data.Game_ID).to.equal(game_id)
        })
      })
    })
    describe('PUT', function(){
      it("Should return with no errors", function(){

      })
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
