var mongoose = require('mongoose'),
   Schema   = mongoose.Schema;
    var User = mongoose.model('User');


var friendSchema = new Schema({
    username: {type : String},
    friend:  { type: Schema.ObjectId, ref: "User" }
});
module.exports = mongoose.model("Friend", friendSchema);