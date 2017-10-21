//Setup the database model for mongoose
let mongoose = require('mongoose')
let Schema = mongoose.Schema

var GameSchema = new Schema({
  Game_Status: {
    type: String,
    enum: ['Setup','In play', 'Finished'],
    default:'Setup',
    required:'Game_Status must exist'
  },
  Game_ID: {
    type: String,
    required: 'The unique identifier must exist'
  },
  Game_Board: {
    type: [{
      type:[{
        type: String,
        enum: ['.', 'R', 'B']
      }]
    }],
    required:"Game must have a board"
  },
  Game_Score: {
    Red:{
	type: Number,
      required:"Red must have a score",
      default:0
    },
    Black:{
	type:Number,
      required:"Black must have a score",
      default:0
    }
  }
})

module.exports = mongoose.model('Games', GameSchema)
