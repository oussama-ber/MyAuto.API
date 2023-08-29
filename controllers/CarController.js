const VoitureModel = require("../models/Voiture");
const EntretienModel = require("../models/Entretien");

exports.getCars = (req, res, next) => {
  const carQuery = VoitureModel.find();
  carQuery
    .then((allRequest) => {
      return allRequest;
    })
    .then((allCars) => {
      res.status(200).json({
        message: "Cars fetched successfully!",
        allCars: allCars,
      });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Fetching cars failed!",
      });
    });
}
exports.getFilteredCars = (req, res, next) => {
   const prixMax = req.body.prixMax;
   const prixMin = req.body.prixMin;
   const marqueFilter = req.body.marque;
   const modeleFilter = req.body.modele;
   const kilometrageMin = req.body.kilometrageMin;
   const kilometrageMax = req.body.kilometrageMax;
   const dateMin = req.body.dateMin;
   const dateMax = req.body.dateMax;
   const carburant = req.body.carburant;
   const boiteVitesse = req.body.boiteVitesse;

   const marqueRegexArray = marqueFilter.map(marque => new RegExp(marque, 'i'));
   const modeleRegexArray = modeleFilter.map(modele => new RegExp(modele, 'i'));
   const carburantRegexArray = carburant.map(carbur => new RegExp(carbur, 'i'));
   const boiteVitesseRegexArray = boiteVitesse.map(boiteV => new RegExp(boiteV, 'i'));

//   const carQuery = VoitureModel.find({ 
//     prix: { $gt: prixMin },
//     prix: { $lte: prixMax }, 
//     kilometrage: { $gt: kilometrageMin },
//     kilometrage: { $lte: kilometrageMax }, 
//     marque: { $in: marqueRegexArray }, 
//     marque: { $in: marqueRegexArray }, 
//     modele: { $in: modeleRegexArray }, 
//     carburant: { $in: carburantRegexArray }, 
//     boiteVitesse: { $in: boiteVitesseRegexArray }, 
//     $expr: {
//         $and: [
//           { $gte: [{ $year: '$createdDate' }, dateMin] },
//           { $lte: [{ $year: '$createdDate' }, dateMax] }
//         ]
//       }
// })
const carQuery = VoitureModel.find();
if (prixMin > 0) {
    carQuery.where('prix').gt(prixMin);
  }
  
  if (prixMax > 0) {
    carQuery.where('prix').lte(prixMax);
  }
  
  if (kilometrageMin > 0) {
    carQuery.where('kilometrage').gt(kilometrageMin);
  }
  
  if (kilometrageMax > 0) {
    carQuery.where('kilometrage').lte(kilometrageMax);
  }
  
  if (marqueRegexArray.length > 0) {
    carQuery.where('marque').in(marqueRegexArray);
  }
  
  if (modeleRegexArray.length > 0) {
    carQuery.where('modele').in(modeleRegexArray);
  }
  
  if (carburantRegexArray.length > 0) {
    carQuery.where('carburant').in(carburantRegexArray);
  }
  
  if (boiteVitesseRegexArray.length > 0) {
    carQuery.where('boiteVitesse').in(boiteVitesseRegexArray);
  }
  
  if (dateMin > 0 && dateMax > 0) {
    carQuery.where({
      $expr: {
        $and: [
          { $gte: [{ $year: '$createdDate' }, dateMin] },
          { $lte: [{ $year: '$createdDate' }, dateMax] }
        ]
      }
    });
  }
  carQuery
    .then((allRequest) => {
      return allRequest;
    })
    .then((allCars) => {
      res.status(200).json({
        message: "Filtered Cars fetched successfully!",
        allCars: allCars,
        count: allCars.length
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
        message: "Fetching cars failed!",
      });
    });
}
exports.getLatestCars = (req, res, next) => {
  const carQuery = VoitureModel.find()
    .sort({ createdDate: -1 })
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
//get filters
exports.getFilters = async (req, res, next) => {
  try {
    const distinctMarquesQuery = VoitureModel.distinct("marque")
      
    const minPrixQuery =  await VoitureModel.aggregate([
      { $group: { _id: null, prixMin: { $min: "$prix" } } }
    ]).then((result)=>{
      return result[0].prixMin;
    })  
    const maxPrixQuery  = await VoitureModel.aggregate([
      { $group: { _id: null, prixMax: { $max: "$prix" } } }
    ]).then((result)=>{
      return result[0].prixMax;
    }); 
    const minKilomertageQuery =  await VoitureModel.aggregate([
      { $group: { _id: null, minValue: { $min: "$kilometrage" } } }
    ]).then((result)=>{
      return result[0].minValue;
    })  
    const maxKilometrageQuery  = await VoitureModel.aggregate([
      { $group: { _id: null, maxValue: { $max: "$kilometrage" } } }
    ]).then((result)=>{
      return result[0].maxValue;
    }); 
    const distinctCarburantsQuery = VoitureModel.distinct("carburant");
    const distinctBoitVitessesQuery = VoitureModel.distinct("boiteVitesse");

    const filterQuery = VoitureModel.find().then(async (results)=>{
      const distinctMarquesData = await distinctMarquesQuery.then((result)=>{
        return result
      })
      const distinctBoiteVitessesData = await distinctBoitVitessesQuery.then((result)=>{
        return result
      })
      const distinctCarburantsData = await distinctCarburantsQuery.then((result)=>{
        return result
      })
      res.status(200).json({
        distinctMarques: distinctMarquesData,
        distinctCarburants: distinctCarburantsData,
        distinctBoiteVitesses: distinctBoiteVitessesData,
        message: "fetched successfully",
        minPrix: minPrixQuery,
        maxPrix: maxPrixQuery,
        minKilometrage: minKilomertageQuery,
        maxKilometrage: maxKilometrageQuery,
      });

    })
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Fetching Requests failed!",
    });
  }
}