const VoitureModel = require("../models/Voiture");
const EntretienModel = require("../models/Entretien");

exports.getCars = (req, res, next) => {
  const carQuery = VoitureModel.find();
  carQuery
    .then((allRequest) => {
      return RequestModel.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Cars fetched successfully!",
        requestCount: count,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching cars failed!",
      });
    });
}
exports.getLatestCars = (req, res, next) => {
  const carQuery = VoitureModel.find()
    .sort({ CreatedDate: -1 })
    .limit(4) 
    .then((result)=>{
        res.status(200).json({
            message: "lastest Cars fetched successfully!",
            lastestCars: result,
        });
    })
    .catch((error)=>{
        res.status(500).json({
            error: error,
            message: "Fetching cars failed!",
        });
    });
}
exports.getCarDetailsById = async (req, res, next) => {
    const vId = req.body.voitureId
    const carQuery = await VoitureModel.findOne({_id: vId });
    if(carQuery){
        const entretienQuery = await EntretienModel.find({VoitureId: carQuery._id})
        .then((resultentretien)=>{
            res.status(200).json({
                message: "Car details fetched successfully!",
                historyDetails: resultentretien,
                car: carQuery,
            });
        }).catch((error)=>{
            res.status(500).json({
                error: error,
                message: "Fetching entretien history failed!",
            });
        })
    }else{
        res.status(500).json({
        message: "Car does not exists!",
        });
    }
}
exports.SaveCar =  async (req, res, next) => {
    const carToSave = new VoitureModel({
        Marque: req.body.marque,
        Modele: req.body.modele,
        DateMiseCirculation: new Date(),
        CreatedDate: new Date(),
        Carburant: req.body.carburant,
        BoiteVitesse: req.body.boiteVitesse,
        Kilometrage: req.body.kilometrage,
        Options: req.body.options
    });
    carToSave.save()
    .then((createdCar)=>{
        res.status(201).json({
            createdCar: createdCar,
            message: "Car created successfully"
        });
    })
    .catch((error)=>{
        res.status(500).json({
            error: error,
            message: "could not save the car!",
        });
    })
}
exports.UpdateCarDate = async (req, res, next) => {
    const requestIdInput = req.body._id;
      const query = await VoitureModel.findById(requestIdInput)
        .then((updatedCar)=>{
            updatedCar.CreatedDate =  new Date();
            updatedCar.save()
            .then((updatedCarSaved)=>{res.status(200).json({ 
                message: "car Updated and saved successful!", 
                updatedCar: updatedCarSaved 
            });})
            .catch((error) => {
                res.status(500).json({
                    error: error,
                    message: "could not save the car!",
                });
            });
        })
        .catch((error) => {
            res.status(500).json({
                error: error,
                message: "could not fetch the car!",
            });
          });   
}