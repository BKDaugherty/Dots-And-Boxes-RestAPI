//Utility functions for encapsulating messages that will be
//sent to client.
const createSuccessObject = function(messageData, code){
  return {
    error:null,
    code:code,
    data:messageData
  }
}

module.exports = {
  createSuccessObject
}
