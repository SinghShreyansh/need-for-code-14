const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    dummy:{
        type: String,
        required: true
    },
    profileImg:{
        type: String
    }

  });

module.exports = mongoose.model('usercontents', UserSchema);