const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 

  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team', default: [] }],
  boxes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Box', default: [] }]
}, {collection: 'Users'});

module.exports = mongoose.model('User', userSchema);
