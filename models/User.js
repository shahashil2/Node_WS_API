var mongoose = require("mongoose");

mongoose.connect("mongodb://dipakSingh:dipaksingh@localhost/userDatabase");


var Schema = mongoose.Schema;


var userSchema = new Schema({
  name:String,
  email:{type:String,required:true,unique:true},
  password:{type:String,required:true},
  age:Number,
  created_at:Date
});


userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

userSchema.methods.dudify = function(){
  this.name = this.name + "dude"

  return this.name
}

var User = mongoose.model('User',userSchema);

module.exports = User;

