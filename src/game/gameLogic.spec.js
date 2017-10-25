const gameLogic = require('./gameLogic')
const expect = require('chai').expect
const mocha = require('mocha')

describe("Game Logic Testing", function(){
  describe("allocateGameBoard", function(){
    it("Allocates board with correct size", function(){
      const board = gameLogic.allocateGameBoard(4)

      //9 squares!
      expect(board.length).to.equal(9)
    })
  })
  describe("Check edge", function(){
    it("checkEdge should return correctly", function(){
      const board = gameLogic.allocateGameBoard(4)
      const edge = gameLogic.checkEdge(board, {x:0, y:0}, {x:1, y:0})
      expect(edge).to.equal(".")
    })
  })

  describe("Square Class", function(){
    it("Should allocate a square", function(){
      const square = new gameLogic.Square(1)
    })
    it("Should populate the square", function(){
      let square1 = new gameLogic.Square(1)
      square1.edgeRight = "HelloWorld"
      console.log("RET value")
      console.log(new gameLogic.Square().populateSquare(square1))
      console.log("SQUARE VALUE")
    })
  })

  describe("Update edge", function(){
    it("Edge should be updated", function(){
      const board = gameLogic.allocateGameBoard(4)
      const topLeft = {x:0, y:0}
      const topLeftDown = {x:1, y:0}
      const edge = gameLogic.checkEdge(board, topLeft, topLeftDown)
      expect(edge).to.equal(".")
      const newBoard = gameLogic.placeEdge(board, topLeft, topLeftDown, "R")
      const newEdge = gameLogic.checkEdge(newBoard, topLeft, topLeftDown)
      expect(newEdge).to.equal("R")
    })
  })
})
