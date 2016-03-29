var mongoose = require('mongoose');
    Schema   = mongoose.Schema;



var userSchema = new Schema({

    username: {type : String},
    fullname:    { type: String },
    email:   { type: String},
    password: {type: String},
    level: {type: String},
    age:   { type: String },
    sex:   { type: String },
    weight:   { type: String },
    height: {type: String},
    created: {type: Date, default: Date.now}
    }, {
    versionKey: false // You should be aware of the outcome after set to false (elimina __V)
});

module.exports = mongoose.model('User', userSchema);
