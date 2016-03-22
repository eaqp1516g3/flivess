var mongoose = require('mongoose');
    Schema   = mongoose.Schema;
//    var Friend = mongoose.model('Friend');


var userSchema = new Schema({

    username: {type : String},
    fullname:    { type: String },
    email:   { type: String},
    level: {type: String},
    age:   { type: String },
    sex:   { type: String },
    weight:   { type: String },
    height: {type: String},
   // imageUrl: {type: String},
    created: {type: Date, default: Date.now}
    }, {
    versionKey: false // You should be aware of the outcome after set to false
});

    // friends: [{
    //     type:mongoose.Schema.type.ObjectId,
    //     ref:'Friend'
    // }]


module.exports = mongoose.model('User', userSchema);
