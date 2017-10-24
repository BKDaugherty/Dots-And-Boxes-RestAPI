//Setup the database model for mongoose
let mongoose = require('mongoose')
let Schema = mongoose.Schema

let SquareSchema = new Schema({
  numTaken:{
    type:Number,
    default:0
  },
  edgeBottom:{
    type:String,
    default:"."
  },
  edgeTop:{
    type:String,
    default:"."
  },
  edgeRight:{
    type:String,
    default:"."
  },
  edgeLeft:{
    type:String,
    default:"."
  },
  owner:{
    type:String,
    default:"."
  }
})

let GameSchema = new Schema({
  Game_Board: [SquareSchema],
  })

module.exports = mongoose.model('Games', GameSchema)
