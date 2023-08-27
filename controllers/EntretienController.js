const EntretienModel = require("../models/Entretien");

exports.getEntretien = async (req, res, next) => {
    const vID =  req.body.vid
    try {
        const entretienQuery = await EntretienModel.find({VoitureId: vID});
        console.log(entretienQuery);
        if (!entretienQuery) {
        res.status(400).send("Entretien not found");
        } else {
        res.status(200).json({
            entretien: entretienQuery,
            message: "entretien fetched seccussfully"
        });
        }
    } catch (error) {
        res.status(400).send("somthing went wrong updating user events");
    }
}
exports.saveEntretien = (req, res, next) => {
    const entretienToCreate = new EntretienModel({
        VoitureId: req.body.vid,
        Date: new Date(0),
        Kilometrage: req.body.kilometrage,
        Description: req.body.Description
    });
      entretienToCreate
        .save()
        .then((createdEntretien) => {
          res.status(201).json({
            message: "Entretien added successfully",
            entretien: {
              ...createdEntretien,
              id: createdEntretien._id,
            },
          });
        })
        .catch((error) => {
            console.log("error", error)
          res.status(500).json({
            error: error,
            message: "Creating an Entretien failed!",
          });
        });
}
