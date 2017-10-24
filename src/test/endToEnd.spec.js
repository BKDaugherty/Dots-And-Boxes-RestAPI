//The end to end / behavioral tests for the API
//const Games = require('./games.js')
const expect = require('chai').expect
const mocha = require('mocha')
const dummyClient = require('../api/client/games')
const crypto = require('crypto')
const gameLogic = require('../game/gameLogic')

//To run end to end / behavioral tests we need to initialize the service first!
describe('Behavioral (End to End) Test Suite', function(){
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
      //Used to cache the game ids for deletion
      let game_id1, game_id2
      it("Should return with no errors", function(){
        const game_id = crypto.randomBytes(12).toString('hex')
        const replacementGame = {
          Game_Board:gameLogic.allocateGameBoard(4)
        }
        game_id1 = game_id
        return dummyClient.replaceGameWithID(game_id, replacementGame)
      })
      it("Should place a game at requested id that is queryable", function(){
        const replacementGameID = crypto.randomBytes(12).toString('hex')
        const replacementGame = {
          Game_Board:gameLogic.allocateGameBoard(4),
        }
        game_id2 = replacementGameID
        return dummyClient.replaceGameWithID(replacementGameID, replacementGame).then( response => {
          return replacementGameID
        }).then(dummyClient.getGameWithID).then(message => {
          expect(JSON.parse(message).data.Game_ID).to.equal(replacementGameID)
        })
      })
      after(function(){
        return Promise.all([dummyClient.deleteGameWithID(game_id1), dummyClient.deleteGameWithID(game_id2)])
      })
    })
    describe('DELETE', function(){
      it("Should return with no errors", function(){
        return dummyClient.deleteGameWithID(game_id)
      })
    })
    //No need to do environment cleanup here because of delete tests!
  })

  describe('/games/:gameID/board', function(){
    //Setup environment
    let game_id
    before(function(){
      return dummyClient.createGame().then(message => {
        game_id = JSON.parse(message).data.Game_ID
      })
    })

    describe('GET with query', function(){
      it("Should return with no errors", function(){
        return dummyClient.checkEdge(game_id, {x:0, y:0}, {x:0, y:1})
      })
      it("Should return unclaimed", function(){
        return dummyClient.checkEdge(game_id, {x:0, y:0}, {x:0, y:1}).then(message => {
          const messageJSON = JSON.parse(message)
          expect(messageJSON.data).to.be.ok
          expect(messageJSON.data.taken).to.be.false
          expect(messageJSON.data.owner).to.be.undefined
        })
      })
    })
    describe('POST', function(){
      it.skip("Should return no errors", function(){
        return dummyClient.placeEdge(game_id, {x:0, y:0}, {x:0, y:1}, "R")
      })
      it("Should add an edge to the board", function(){
        return dummyClient.placeEdge(game_id, {x:0, y:0}, {x:0, y:1}, "B").then(message => {
          const messageJSON = JSON.parse(message)
          console.log(messageJSON)
        })
      })
    })
    //Cleanup environment
    after(function(){
      return dummyClient.deleteGameWithID(game_id)
    })
  })
})
