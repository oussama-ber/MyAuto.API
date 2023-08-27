const mongoose = require('mongoose');

const controleMecaniqueSchema = mongoose.Schema({
    VoitureId: { type : mongoose.Schema.Types.ObjectId, ref: "Voiture", required : false},
    Pneumatique: {
        PAVG : { Marque: {type: String}, Dimensions: {type: String}, ProfondeurRestante: {type: String}, TypePneu: {type: Date}},
        PAVD : { Marque: {type: String}, Dimensions: {type: String}, ProfondeurRestante: {type: String}, TypePneu: {type: Date}},
        PARG : { Marque: {type: String}, Dimensions: {type: String}, ProfondeurRestante: {type: String}, TypePneu: {type: Date}},
        PARD : { Marque: {type: String}, Dimensions: {type: String}, ProfondeurRestante: {type: String}, TypePneu: {type: Date}},
    },
    Freinage: {
        plaquetteAV: { type: String},
        plaquetteAR: { type: String},
        DisqueAV: { type: String},
        DisqueAR: { type: String},
    },
    Distribution: {TypeDisribution: { type: String}},
    Moteur: {
        NiveauHuile: { type: String},
        NiveauLiquideFrein: { type: String},
        NiveauLiquideRefroidissement: { type: String},
        ExamenVisuelFuitesHuile: { type: String},
        CourroieDaccessoire: { type: String},
        EtatBatterieLinspection: { type: String},
    },
    Chassis: {
        TrainAvant: { Rotules: { type: String}, Cardans : { type: String}, Amortisseurs : { type: String}},
        TrainArriere: { Rotules: { type: String}, Cardans : { type: String}, Amortisseurs : { type: String}}
    },
    TestConduite: {resultat: { type: String}, vitesseMax: { type: String}}
});

module.exports = mongoose.model('ControleMecanique', controleMecaniqueSchema);
