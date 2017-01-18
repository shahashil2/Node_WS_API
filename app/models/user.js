var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var userSchema = new Schema({
  name:String,
  email:{type:String,required:true},
  password:{type:String,required:true},
  created_at:Date
});


userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// userSchema.methods.dudify = function(){
//   this.name = this.name + "dude"

//   return this.name
// }

var User = mongoose.model('User',userSchema);

module.exports = User;

