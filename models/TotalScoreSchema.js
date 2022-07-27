const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const TotalScoreSchema = new Schema({
    highestscore:{
        type: Number,
        default:0
    },
    currentscore: {
        type: Number,
        default:0
    },
    totalattempt: {
        type: Number,
        default:0
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'usercontents',
    }

  });

module.exports = mongoose.model('score', TotalScoreSchema);