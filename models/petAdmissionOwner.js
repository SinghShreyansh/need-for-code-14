const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const petAdmissionSchema = new Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'usercontents',
    },
    ownerDetails:{
        type: Object
    }

  });

module.exports = mongoose.model('petAdmissionUser', petAdmissionSchema);