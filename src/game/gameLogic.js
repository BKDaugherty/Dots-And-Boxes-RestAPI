////////////Game Constants/////////
const BOARD_SIZE = 4
const LOG_MODE = process.env.LOG_MODE

///////////Game Objects////////////
class Square {
  //Default constructor
  constructor(squareNum){
    this.num = squareNum
    this.edgeBottom = "."
    this.edgeRight = "."
    this.edgeTop = "."
    this.edgeLeft = "."
    this.taken = 0
    this.owner = "."
    return this
  }
  //Used for checking the squares we receive
  //from the database
  populateSquare(otherSquare){
    this.num = otherSquare.num
    this.edgeBottom = otherSquare.edgeBottom
    this.edgeRight = otherSquare.edgeRight
    this.edgeTop = otherSquare.edgeTop
    this.edgeLeft = otherSquare.edgeLeft
    this.taken = otherSquare.taken
    this.owner = otherSquare.owner
    return this
  }
}

//////////Game helper functions for clean input and output///////////
//Creates the squares of the gamebaord
const allocateGameBoard = function(size){
  let gameBoard = []
  //Game Board is a grid of (size - 1) squared grids
  for(let i = 0; i < Math.pow(size-1, 2); i++){
    gameBoard.push(new Square(i))
  }

  if(LOG_MODE)
    console.log("Creating board of size " + size)

  return gameBoard
}

const checkEdge = function (gameBoard, coord1, coord2){
  if(checkValidityOfCoord(coord1) && checkValidityOfCoord(coord2) && checkValidityOfEdge(coord1, coord2)){
    const squares = findSquaresAssocWithEdge(gameBoard, coord1, coord2)
    //Doesnt matter which square we choose, as long as data is in consistent state!
    if(squares){
      return getEdgeInSquareData(squares[0], coord1, coord2)
    } else {
      if(LOG_MODE)
        console.log("Unable to locate squares associated with edge... Returning null")
    }
  } else {
    if(LOG_MODE)
      console.log("Edge is invalid... returning null")
    return null
  }
}
const checkValidityOfEdge = function(coord1, coord2){
  return coord1.x === coord2.x && (Math.abs(coord1.y - coord2.y) === 1) ||  (coord1.y === coord2.y && (Math.abs(coord1.x - coord2.x) === 1))
}

const checkValidityOfCoord = function(coord){
  return (coord.x >= 0 && coord.y <= BOARD_SIZE && coord.x <= BOARD_SIZE && coord.y >= 0)
}

//Assume that data model is consistent, and we can check any of
//the stored edges in our system that correspond to these coords
const findSquaresAssocWithEdge = function(gameBoard, coord1, coord2){
  const associatedSquares = gameBoard.filter(elem => {
    return isInSquare(elem, coord1) && isInSquare(elem, coord2)
  })

  return associatedSquares;
}


const isInSquare = function(square, coord){
  const SD = getSquareDim(square)
  return (coord.x <= (SD.right) && coord.x >= SD.left) && (coord.y <= (SD.bottom) && coord.y >= (SD.top))
}

//Gets the boundaries of each square in the coordinate space
const getSquareDim = function(square){
   return {
    left :square.num % 3,
    right : (square.num % 3) + 1,
    top : square.num / 3,
    bottom : (square.num / 3) + 1
  }
}

// Checks the square for the edge given (assumes this is a valid edge)!
const getEdgeInSquareData = function(square, coord1, coord2){

  const SD = getSquareDim(square)

  if(coord1.x == coord2.x){
    //Either left or right
    if(coord1.x == SD.left){
      return square.edgeLeft
    } else if (coord1.x == SD.right){
      return square.edgeRight
    } else {
      return null
    }
  } else if(coord1.y == coord2.y){
    //Either top or bottom
    if(coord1.y == SD.top){
      return square.edgeTop
    } else if(coord1.y == SD.bottom){
      return square.edgeBottom
    } else {
      return null
    }
  } else {
    return null
  }
}

const addEdgeToSquare = function(square, coord1, coord2, color){
  let updatedSquare = new Square(square.num)
  const SD = getSquareDim(square)

  //Populate the updated square with the current squares data
  updatedSquare.populateSquare(square)

  if(coord1.x === coord2.x){
    //Either left or right
    if(coord1.x === SD.left){
      updatedSquare.edgeLeft = color
    } else if (coord1.x === SD.right){
      updatedSquare.edgeRight = color
    }
  } else if(coord1.y === coord2.y){
    //Either top or bottom
    if(coord1.y === SD.top){
      updatedSquare.edgeTop = color
    } else if(coord1.y === SD.bottom){
      updatedSquare.edgeBottom = color
    }
  }

  //Report score to board
  updatedSquare.taken += 1
  if(updatedSquare.taken == 4){
    updatedSquare.owner = color
  }

  return updatedSquare
}

//Checks if a square num is in a square list
const isInSquareList = function(list, squareNum){
  if(list === null)
    return false
  for(let i = 0; i < list.length; i++){
    //Note, double equality is required here
    if(list[i].num == squareNum){
      return true
    }
  }
  return false
}

//Returns an updated gameboard
const placeEdge = function(gameBoard, coord1, coord2, color){

  if(checkValidityOfEdge(coord1, coord2) && checkValidityOfCoord(coord1) && checkValidityOfCoord(coord2) && checkValidityOfColor(color)){
    const squares = findSquaresAssocWithEdge(gameBoard, coord1, coord2)

    //These are all the updated squares from the previous map
    const updatedSquares = squares.map(square => {
      return addEdgeToSquare(square, coord1, coord2, color)
    })

    //Build the updated board
    let updatedBoard = []
    for(let i = 0; i < gameBoard.length; i++){
      if(isInSquareList(updatedSquares, i)){
        const squareToAdd = new Square(i).populateSquare(updatedSquares[i])
        updatedBoard.push(squareToAdd)
      } else {
        const squareToAdd = new Square(i).populateSquare(gameBoard[i])
        updatedBoard.push(squareToAdd)
      }
    }

    return updatedBoard
  } else {
    if(LOG_MODE)
      console.log("Invalid input to place edge... returning null")
    return null
  }

}

const checkValidityOfColor = function(color){
  return color === "." || color === "R" || color === "B"
}


module.exports = {
  Square,
  allocateGameBoard,
  checkEdge,
  placeEdge
}
