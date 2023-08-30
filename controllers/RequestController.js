const RequestModel = require("../models/Request");
const VoitureModel = require("../models/Voiture");

exports.getRequests = (req, res, next) => {
    const requestQuery = RequestModel.find();
    requestQuery
      .then((allRequests) => {
        return allRequests;
      })
      .then((allRs) => {
        res.status(200).json({
          message: "Requests fetched successfully!",
          allRequests: allRs,
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Fetching requests failed!",
        });
      });
  }
exports.saveRequest =  async (req, res, next) => {
    console.log(req.body)
    const requestToSave = new RequestModel({
        marque: req.body.marque,
        modele: req.body.modele,
        dateMiseCirculation: req.body.dateMiseCirculation,
        carburant: req.body.carburant,
        boiteVitesse: req.body.boiteVitesse,
        kilometrage: req.body.kilometrage,
        email: req.body.email,
        telephone: req.body.telephone,
        tag: "Pending",
        createdDate: new Date()
    });
    requestToSave.save()
    .then((createdRequest)=>{
        res.status(201).json({
            createdRequest: createdRequest,
            message: "Request created successfully"
        });
    })
    .catch((error)=>{
        res.status(500).json({
            error: error,
            message: "could not save the car!",
        });
    })
}
exports.deleteRequestById =  async (req, res, next) => {
    const requestId = req.body.requestId;
        RequestModel.deleteOne({ _id: requestId })
        .then((result) => {
          console.log(result);
          if (result.deletedCount > 0) {
            res.status(200).json({ message: "Deletion successful!" });
          } else {
            res.status(401).json({ message: "Nothing deleted !" });
          }
        })
        .catch((error) => {
          res.status(500).json({
            message: "Fetching events failed!",
          });
        });
}
