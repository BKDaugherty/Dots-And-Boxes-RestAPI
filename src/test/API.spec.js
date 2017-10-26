//The unit / behavioral tests for the API
const expect = require('chai').expect
const mocha = require('mocha')
const dummyClient = require('../api/client/games')
const crypto = require('crypto')
const gameLogic = require('../game/gameLogic')

//To run unit / behavioral tests we need to initialize the service first!
describe('Behavioral / Unit Test Suite', function(){
  //Positive Tests to ensure correct functionality
  describe("Positive Tests", function(){
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
            expect(messageJSON.data.edgeOwner).to.be.null
          })
        })
      })
      describe('POST', function(){
        it("Should return no errors", function(){
          return dummyClient.placeEdge(game_id, {x:0, y:0}, {x:0, y:1}, "R")
        })
        it("Should add an edge to the board", function(){
          return dummyClient.placeEdge(game_id, {x:0, y:0}, {x:1, y:0}, "B")
            .then(message => {
            expect(message.code).to.equal("201 Created")
          })
          .then(() => {
            return dummyClient.checkEdge(game_id, {x:0, y:0}, {x:1, y:0})
          }).then(message => {
            const messageJSON = JSON.parse(message)
            expect(messageJSON.data).to.be.ok
            expect(messageJSON.data.taken).to.be.true
            expect(messageJSON.data.edgeOwner).to.equal("B")
          })
        })
      })
      //Cleanup environment
      after(function(){
        return dummyClient.deleteGameWithID(game_id)
      })
    })
  })

  //Negative Tests to ensure security and stability
  //Note: THERE SHOULD BE MANY MORE NEGATIVE TESTS
  //If I had more time, I would extensively test each
  //function to ensure that the API can handle many
  //different forms of bad input!
  describe("Negative Tests", function(){
    describe('/games/:gameID', function(){
      describe('GET', function(){
        describe("Attempt to get invalid gameID", function(){
          it("Should return an error with status code 404", function(){
            return dummyClient.getGameWithID(5).catch(error => {
              expect(error.statusCode).to.equal(404)
            })
          })
        })
        describe("Attempt to get deleted gameID", function(){
          it("Should return an error with status code 404", function(){
            let gameID
            return dummyClient.createGame()
              .then(message => {
                gameID = JSON.parse(message).data.Game_ID
                return gameID
            }).then(dummyClient.deleteGameWithID)
              .then(() => {
                return dummyClient.getGameWithID(gameID)
            }).catch(error => {
              expect(error.statusCode).to.equal(404)
            })
          })
        })
        describe("Attempt to get valid gameID that is unused", function(){
          it("Should return an error with status code 404", function(){
            return dummyClient.getGameWithID(crypto.randomBytes(12).toString('hex'))
            .catch(error => {
              expect(error.statusCode).to.equal(404)
            })
          })
        })
      })

      describe('PUT', function(){
        //Used to cache the game ids for deletion
        let game_id
        before(function(){
          return dummyClient.createGame().then(message => {
            game_id = JSON.parse(message).data.Game_ID
          })
        })
        describe("Attempt to place an invalid game board", function(){
          it("Should return an error with status code 400", function(){
            return dummyClient.replaceGameWithID(game_id, {"Game_Board":true})
            .catch(error => {
              expect(error.statusCode).to.equal(400)
            })
          })
        })
        describe("Attempt to place a game with no game board", function(){
          it("Should return an error with status code 400", function(){
            return dummyClient.replaceGameWithID(game_id, {"Game_Board":null})
            .catch(error => {
              expect(error.statusCode).to.equal(400)
            })
          })
        })
      })
      describe('DELETE', function(){
        describe("Attempt to delete an invalid game", function(){
          it("Should return an error with status code 404", function(){
            return dummyClient.deleteGameWithID(5).catch(error => {
              expect(error.statusCode).to.equal(404)
            })
          })
        })
        describe("Attempt to delete a nonexistent, but valid game", function(){
          it("Should return an error with status code 404", function(){
            return dummyClient.deleteGameWithID(crypto.randomBytes(12).toString('hex')).catch(error => {
              expect(error.statusCode).to.equal(404)
            })
          })
        })
      })
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
        describe("Attempt to get edge from nonexistent board", function(){
          it("Should return an error with status code 404", function(){
            return dummyClient.checkEdge(5, 1,2,1,3).catch(error => {
              expect(error.statusCode).to.equal(404)
            })
          })
        })
        describe("Attempt to get nonexistent edge", function(){
          it("Should return an error with status code 400", function(){
            return dummyClient.checkEdge(game_id, 1,2,1,5).catch(error => {
              expect(error.statusCode).to.equal(400)
            })
          })
        })
        describe("Attempt to get edge with missing parameters", function(){
          it("Should return an error with status code 400", function(){
            return dummyClient.checkEdge(game_id, 1,2).catch(error => {
              expect(error.statusCode).to.equal(400)
            })
          })
        })

      })
      describe('POST', function(){
        describe("Attempt to place edge on invalid board", function(){
          it("Should return an error with status code 404", function(){
            return dummyClient.placeEdge(5, 1,2, 1,3, "R").catch(error => {
              expect(error.statusCode).to.equal(404)
            })
          })
        })
        describe("Attempt to place on invalid edge", function(){
          it("Should return an error with status code 400", function(){
            return dummyClient.placeEdge(game_id, 1,2, 1,6, "R").catch(error => {
              expect(error.statusCode).to.equal(400)
            })
          })
        })
        describe("Attempt to place on edge with invalid color", function(){
          it("Should return an error with status code 400", function(){
            return dummyClient.placeEdge(game_id, 1,2, 1,6, "G").catch(error => {
              expect(error.statusCode).to.equal(400)
            })
          })
        })
        describe("Attempt to place edge with missing parameters", function(){
          it("Should return an error with status code 400", function(){
            return dummyClient.placeEdge(game_id, 1,2).catch(error => {
              expect(error.statusCode).to.equal(400)
            })
          })
        })
        //Cleanup environment
        after(function(){
          return dummyClient.deleteGameWithID(game_id)
        })
      })
    })
  })
})
