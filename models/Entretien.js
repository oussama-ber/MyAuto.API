const mongoose = require('mongoose');

const entretienSchema = mongoose.Schema({
  voitureId: { type : mongoose.Schema.Types.ObjectId, ref: "Voiture", required : false},
  date: {type: Date},
  kilometrage: { type: Number},
  description: { type: String}
});

module.exports = mongoose.model('Entretien', entretienSchema);
