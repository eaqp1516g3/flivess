var mongoose = require('mongoose');
    Schema   = mongoose.Schema;



var userSchema = new Schema({
    facebook_id:        { type: String},
    username:           { type: String},
    fullname:           { type: String},
    email:              { type: String},
    password:           { type: String},
    imgurl:             { type: String},
    city:               { type: String},
    age:                { type: String},
    sex:                { type: String},
    weight:             { type: String},
    height:             { type: String},
    km_cycled:          { type: Number},
    created:            { type: Date, default: Date.now}
    },
    {
    versionKey: false // You should be aware of the outcome after set to false (elimina __V)
});

module.exports = mongoose.model('User', userSchema);
