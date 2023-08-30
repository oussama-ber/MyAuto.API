const mongoose = require('mongoose');

const RequestSchema = mongoose.Schema({
    marque: { type: String, required: true },
    modele: { type: String, required: true },
    dateMiseCirculation: {type: String},
    carburant:{type: String},
    boiteVitesse:{type: String},
    kilometrage:{type: Number},
    email:{type: String},
    telephone:{type: Number},
    tag:{type: String},
    createdDate: {type: Date}
});
//tag = [reserve, vendu]
module.exports = mongoose.model('Request', RequestSchema);
