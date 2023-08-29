const mongoose = require('mongoose');

const voitureSchema = mongoose.Schema({
    prix: { type: Number},
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    dateMiseCirculation: {type: Date, required: true},
    carburant:{type: String},
    boiteVitesse:{type: String},
    kilometrage:{type: Number},
    options:[{type: String}],
    entretienHistory: [{ type : mongoose.Schema.Types.ObjectId, ref: "Entretien", required : false}],
    etatExterieur:[ { EXTitre:{type: String}, EXDescription: {type: String} } ],
    etatInterieur:[ { EITitre:{type: String}, EIDescription: {type: String} } ],
    tag:{type: String},
    createdDate: {type: Date}
});
//tag = [reserve, vendu]
module.exports = mongoose.model('Voiture', voitureSchema);
