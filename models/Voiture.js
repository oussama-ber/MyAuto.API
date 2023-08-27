const mongoose = require('mongoose');

const voitureSchema = mongoose.Schema({
    Marque: { type: String, required: true },
    Modele: { type: String, required: true },
    DateMiseCirculation: {type: Date, required: true},
    Carburant:{type: String},
    BoiteVitesse:{type: String},
    Kilometrage:{type: String},
    Options:[{type: String}],
    EntretienHistory: [{ type : mongoose.Schema.Types.ObjectId, ref: "Entretien", required : false}],
    EtatExterieur:[ { EXTitre:{type: String}, EXDescription: {type: String} } ],
    EtatInterieur:[ { EITitre:{type: String}, EIDescription: {type: String} } ],
    Tag:{type: String},
    CreatedDate: {type: Date}
});
//tag = [reserve, vendu]
module.exports = mongoose.model('Voiture', voitureSchema);
