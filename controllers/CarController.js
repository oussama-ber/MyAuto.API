const VoitureModel = require("../models/Voiture");
const EntretienModel = require("../models/Entretien");
const ControleMecaniqueModel = require("../models/ControleMecanique");
const ImageModel = require("../models/TestImage");

exports.getCars = (req, res, next) => {
  
  const carQuery = VoitureModel.find()
  carQuery
    .then((allRequest) => {
      return allRequest;
    })
    .then(async (allCars) => {
      var allCarsDetails = [];
      for (let index = 0; index < allCars.length; index++) {
        const currentCarImages = await ImageModel.find({voitureId : allCars[index]._id})
        allCarsDetails.push(
          {
            car: allCars[index],
            image: currentCarImages[currentCarImages.length - 1]
          })
      }
      res.status(200).json({
        message: "Cars fetched successfully!",
        allCars: allCars,
        allCarsDetails :allCarsDetails
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
        message: "Fetching cars failed!",
      });
    });
}
exports.getFilteredCars = (req, res, next) => {
   const prixMax = req.body.prixMax;
   const prixMin = req.body.prixMin;
   let marqueFilter = req.body.marque;
   let modeleFilter = req.body.modele;
   const kilometrageMin = req.body.kilometrageMin;
   const kilometrageMax = req.body.kilometrageMax;
   const dateMin = req.body.dateMin;
   const dateMax = req.body.dateMax;
   let carburant = req.body.carburant;
   let boiteVitesse = req.body.boiteVitesse;
   const marqueRegexArray = marqueFilter.map(marque => new RegExp(marque, 'i'));
   const modeleRegexArray = modeleFilter.map(modele => new RegExp(modele, 'i'));
   const carburantRegexArray = carburant.map(carbur => new RegExp(carbur, 'i'));
   const boiteVitesseRegexArray = boiteVitesse.map(boiteV => new RegExp(boiteV, 'i'));
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
    .then(async (allCars) => {
      var allCarsDetails = [];
      for (let index = 0; index < allCars.length; index++) {
        const currentCarImages = await ImageModel.find({voitureId : allCars[index]._id})
        allCarsDetails.push(
          {
            car: allCars[index],
            image: currentCarImages[currentCarImages.length - 1]
          })
      }
      res.status(200).json({
        message: "Filtered Cars fetched successfully!",
        allCars: allCars,
        count: allCars.length,
        allCarsDetails: allCarsDetails
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
    .then(async (result)=>{
      var allCarsDetails = [];
      for (let index = 0; index < result.length; index++) {
        const currentCarImages = await ImageModel.findOne({voitureId : result[index]._id})

        allCarsDetails.push(
          {
            car: result[index],
            image: currentCarImages != undefined ? currentCarImages : ""
          })
      }
        res.status(200).json({
            message: "lastest Cars fetched successfully!",
            lastestCars: result,
            allCarsDetails: allCarsDetails
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
    const carId = req.query.voitureId
    const carQuery = await VoitureModel.findOne({_id: carId });

    
    if(carQuery){
        const cm = await ControleMecaniqueModel.findOne({voitureId: carQuery._id}).catch((error) => {cm = new ControleMecaniqueModel({})});
        const entretienQuery = await EntretienModel.find({voitureId: carQuery._id})
        .then(async (resultentretien)=>{
            resultentretien = resultentretien.sort((x,y) => {return y.kilometrage - x.kilometrage})
            const currentCarImages = await ImageModel.find({voitureId : carQuery._id});
            const currentCarEntretien = await EntretienModel.find({voitureId : carQuery._id});
            
            res.status(200).json({
                message: "Car details fetched successfully!",
                car: carQuery,
                historyDetails: resultentretien,
                controleMecanique: cm,
                images: currentCarImages,
                entretienHistory: currentCarEntretien,

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
exports.deleteCarById =  async (req, res, next) => {
  const carId = req.body.carId;
    VoitureModel.deleteOne({ _id: carId })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.status(200).json({ message: "Deletion successful!" });
        } else {
          res.status(401).json({ message: "Nothing deleted !" });
        }
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
          message: "Fetching events failed!",
        });
      });
}

exports.saveOffreVoiture =  async (req, res, next) => {
  try {
    var etatExterieurArray = []; 
    for (let index = 0; index < req.body.etatExterieur.length; index++) {
      etatExterieurArray.push(
        {
          exTitre: req.body.etatInterieur[index],
          exDescription: ""
        });
    }
    var etatInterieurArray= []; 
    for (let index = 0; index < req.body.etatInterieur.length; index++) {
      etatInterieurArray.push(
        {
          eiTitre: req.body.etatInterieur[index],
          eiDescription: ""
        });
    }
   
    console.log("req.body.prix", req.body.prix)
    const carToSave = new VoitureModel({
        marque: req.body.marque,
        modele: req.body.modele,
        dateMiseCirculation: new Date(),
        carburant: req.body.carburant,
        boiteVitesse: req.body.boiteVitesse,
        kilometrage: req.body.kilometrage,
        options: req.body.options,
        etatExterieur: etatExterieurArray,
        etatInterieur: etatInterieurArray,
        createdDate: new Date(),
        prix: req.body.prix,
        tag: ''
    });
    carToSave.save()
    .then((createdCar)=>{
      const createdCarId = createdCar._id;
      const controleMecanique = new ControleMecaniqueModel({
      voitureId : createdCarId,
      pneumatique: {
        pAVG : { 
          marque: req.body.pneumatiques.avg.aVGmarque, 
          dimensions: req.body.pneumatiques.avg.aVGdimensions, 
          profondeurRestante: req.body.pneumatiques.avg.aVGprofondeurRestante, 
          typePneu: req.body.pneumatiques.avg.aVGtypePneu
        },
        pAVD : { 
          marque: req.body.pneumatiques.avd.aVDmarque, 
          dimensions: req.body.pneumatiques.avd.aVDdimensions,
          profondeurRestante: req.body.pneumatiques.avd.aVDprofondeurRestante,
          typePneu: req.body.pneumatiques.avd.aVDtypePneu,
        },
        pARG : { 
          marque: req.body.pneumatiques.arg.aRGmarque, 
          dimensions: req.body.pneumatiques.arg.aRGdimensions, 
          profondeurRestante: req.body.pneumatiques.arg.aRGprofondeurRestante, 
          typePneu: req.body.pneumatiques.arg.aRGtypePneu, 
        },
        pARD : { 
          marque: req.body.pneumatiques.ard.aRDmarque, 
          dimensions: req.body.pneumatiques.ard.aRDdimensions, 
          profondeurRestante: req.body.pneumatiques.ard.aRDprofondeurRestante, 
          typePneu: req.body.pneumatiques.ard.aRDtypePneu, 
        },
      },
      freinage: {
        plaquetteAV: req.body.freinage.AvPlaque,
        plaquetteAR: req.body.freinage.aRplaque,
        disqueAV: req.body.freinage.aVdisque,
        disqueAR: req.body.freinage.aRdisque,
      },
      distribution : req.body.distributionType,
      moteur: {
        niveauHuile: req.body.moteur.moteurNiveauHuile,
        niveauLiquideFrein: req.body.moteur.moteurNiveauLiquideFrein,
        niveauLiquideRefroidissement: req.body.moteur.moteurNiveauRefroidissement,
        examenVisuelFuitesHuile: req.body.moteur.examenVisuelFruitesHuile,
        courroieDaccessoire: req.body.moteur.courroieAccessoire,
        etatBatterieLinspection: req.body.moteur.etatBatterie,
      },
      chassis: {
        trainAvant: { 
          rotules: req.body.chassis.trainAvRotules,
          cardans : req.body.chassis.trainAVCardans,
          amortisseurs : req.body.chassis.trainAVAmortisseurs,
        },
        trainArriere: { 
          rotules: req.body.chassis.trainARRotules,
          cardans : req.body.chassis.trainARCardans,
          amortisseurs : req.body.chassis.trainARAmortisseurs,
        }
      },
      testConduite : {
        resultat: req.body.testConduite.resultatFinal,
        vitesseMax: req.body.testConduite.vitesseMax,
      }
      });
      
      var entretienHistoryy = []; 
      for (let index = 0; index < req.body.entretienHistory.length; index++) {
        entretienHistoryy.push(
          {
            voitureId: createdCar._id,
            kilometrage: req.body.entretienHistory[index].kilometrage,
            description: req.body.entretienHistory[index].description,
            date: req.body.entretienHistory[index].date
          });
        } 
      console.log("entretienHistoryy", entretienHistoryy)
      EntretienModel.insertMany(entretienHistoryy)
      .then((createdEntretiens)=>{
        console.log("createdEntretiens", createdEntretiens)
      })
      .catch((entretienError)=>{
        console.log("error",entretienError)
      })
  
      controleMecanique.save().then((resres)=>{
      }).catch((er)=>{
        console.log("er", er)
      })
  
  
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
  } catch (error) {
    console.log("error", error)
  }
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
