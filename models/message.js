var mongoose = require('mongoose');
    Schema   = mongoose.Schema;
    var User = mongoose.model('User');

var messageSchema = new Schema({
    reciver:    { type: String},
    sender: { type: Schema.ObjectId, ref: "User" },
    subject :  {type: String},
    text :  {type: String},
    createdAt: {type: Date, default: Date.now}
   // read:  {type: Boolean}


});
module.exports = mongoose.model('Message', messageSchema);