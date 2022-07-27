const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const ShelterSchema = new Schema({
    name:{
        type: String,
    },
    city_name:{
        type: String,
    },
    address:{
        type: String,
    },
    phone:{
        type: String,
    },
    total_pets:{
        type: String
    },
    total_employee:{
        type: String
    }

  });

module.exports = mongoose.model('sheltercontents', ShelterSchema);