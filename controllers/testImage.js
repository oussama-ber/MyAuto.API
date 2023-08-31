const ImageModel = require("../models/TestImage");
exports.saveImage =  async (req, res, next) => {
    try {
        const ImageToSave = new ImageModel({
            fileBase64: req.body.fileBase64,
        });
        ImageToSave.save();
        console.log("first")
        res.status(201).json({
            createdImage: fileBase64,
            message: "image created successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error,
            message: "could not save the image!",
        });
    }
    
}