const mongoose = require('mongoose');

const controleMecaniqueSchema = mongoose.Schema({
    voitureId: { type : mongoose.Schema.Types.ObjectId, ref: "Voiture", required : false},
    pneumatique: {
        pAVG : { marque: {type: String}, dimensions: {type: String}, profondeurRestante: {type: String}, typePneu: {type: String}},
        pAVD : { marque: {type: String}, dimensions: {type: String}, profondeurRestante: {type: String}, typePneu: {type: String}},
        pARG : { marque: {type: String}, dimensions: {type: String}, profondeurRestante: {type: String}, typePneu: {type: String}},
        pARD : { marque: {type: String}, dimensions: {type: String}, profondeurRestante: {type: String}, typePneu: {type: String}},
    },
    freinage: {
        plaquetteAV: { type: String},
        plaquetteAR: { type: String},
        disqueAV: { type: String},
        disqueAR: { type: String},
    },
    distribution: { type: String},
    moteur: {
        niveauHuile: { type: String},
        niveauLiquideFrein: { type: String},
        niveauLiquideRefroidissement: { type: String},
        examenVisuelFuitesHuile: { type: String},
        courroieDaccessoire: { type: String},
        etatBatterieLinspection: { type: String},
    },
    chassis: {
        trainAvant: { rotules: { type: String}, cardans : { type: String}, amortisseurs : { type: String}},
        trainArriere: { rotules: { type: String}, cardans : { type: String}, amortisseurs : { type: String}}
    },
    testConduite: {resultat: { type: String}, vitesseMax: { type: String}}
});

module.exports = mongoose.model('ControleMecanique', controleMecaniqueSchema);
