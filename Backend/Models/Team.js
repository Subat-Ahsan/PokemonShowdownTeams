const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true},
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required:true }, 
  data: {type: mongoose.Schema.Types.Mixed, default: {}, required:true}, 
  teamText: {type: String, required: true, required:true}, 
  summary: {type: [[String]], default: [], required:true}
}, {collection: 'Teams', timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
