const mongoose = require('mongoose');

const entretienSchema = mongoose.Schema({
  VoitureId: { type : mongoose.Schema.Types.ObjectId, ref: "Voiture", required : false},
  Date: {type: Date},
  Kilometrage: { type: Number},
  Description: { type: String}
});

module.exports = mongoose.model('Entretien', entretienSchema);
