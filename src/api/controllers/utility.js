//Utility functions for encapsulating messages

const createSuccessObject = function(messageData){
  return {
    error:null,
    code:"200",
    data:messageData
  }
}
//Error is a message
const createFailure = function(code, error){
  return {error,code}
}

module.exports = {
  createSuccessObject
}
