const mongoose = require('mongoose');

const testImageSchema = mongoose.Schema({
    voitureId: { type : mongoose.Schema.Types.ObjectId, ref: "Voiture", required : false},
    fileBase64: { type: String},
    fileURL: { type: String}
});

module.exports = mongoose.model('TestImage', testImageSchema);
