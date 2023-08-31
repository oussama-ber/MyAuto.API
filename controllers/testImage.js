const ImageModel = require("../models/TestImage");
exports.saveImage =  async (req, res, next) => {
    try {
        const ImageToSave = new ImageModel({
            fileURL: req.body.imageUrl,
            voitureId: req.body.carId,
        });
        const savedImage = await ImageToSave.save();
        res.status(201).json({
            createdImage: savedImage,
            message: "image created successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "could not save the image!",
        });
    }
    
}