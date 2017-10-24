//Utility functions for encapsulating messages back from the server
const createSuccessObject = function(messageData, code){
  return {
    error:null,
    code:code,
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
