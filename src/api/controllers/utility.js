//Utility functions for encapsulating messages that will be
//sent to client.
const createSuccessObject = function(messageData, code){
  return {
    error:null,
    code:code,
    data:messageData
  }
}

const boardCoordOutOfRange = function(input, BOARD_SIZE){
  return !(input < 0 || input > BOARD_SIZE)
}

//If the parameter is placed in the query
//string, it comes as a string, and we must convert
//it to a number
const checkForString = function(input){
  if(typeof(input) === "string"){
    return parseInt(input)
  }
  else
    return input
}

const validateInputCheckEdge = function(x1, x2, y1, y2, BOARD_SIZE){
  //Filter for strings
  x1 = checkForString(x1)
  x2 = checkForString(x2)
  y1 = checkForString(y1)
  y2 = checkForString(y2)

  const areNumbers = (typeof(x1) == "number") && (typeof(x2) == "number") && (typeof(y1) == "number") && (typeof(y2) == "number")
  const inRange = (boardCoordOutOfRange(x1, BOARD_SIZE) || boardCoordOutOfRange(x2, BOARD_SIZE) || boardCoordOutOfRange(y1, BOARD_SIZE) || boardCoordOutOfRange(y2, BOARD_SIZE))
  return areNumbers && inRange
}

const validateInputPlaceEdge = function(x1, x2, y1, y2, color, BOARD_SIZE){
  const isValidCheck = validateInputCheckEdge(x1,x2,y1,y2, BOARD_SIZE)
  const isValidColor = (color == "R" || color == "B")
  return isValidCheck && isValidColor
}

module.exports = {
  createSuccessObject,
  validateInputCheckEdge,
  validateInputPlaceEdge
}
