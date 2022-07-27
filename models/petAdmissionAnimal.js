const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const petAdmissionAnimalSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref: 'usercontents'
    },
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref: 'petAdmissionUser'
    },
    name:{
      type : String,
    },
    common_name:{
      type : String,
    },
    gender:{
      type:String
    },
    type:{
      type:String
    },
    vaccination:{
      type:String
    },
    petImage:{
      type:String
    },
    age:{
      type:Number,
      default:-1
    }

  });

module.exports = mongoose.model('petAdmissionAnimal', petAdmissionAnimalSchema);