const RequestModel = require("../models/Request");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv')


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
    .then(async (createdRequest)=>{
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        }
        var transporter = nodemailer.createTransport(config);
        const info = await transporter.sendMail({
            from: 'myauto.noreply@gmail.com', 
            to: requestToSave.email, 
            subject: "Request from ", 
            text: `Dear Client,\n Your request has been created successfully at ${requestToSave.createdDate}, we ll review your request as soon as possible.\n
             Please contact our support team for further details. \n \n Best Regards, \n \n MyAuto support Team.`,
          })
          .then((result)=>{
            
            })
          .catch((error)=>{
              res.status(500).json({ error: error});

          })
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
exports.acceptRequest =  async (req, res, next) => {
    const requestToUpdate = new RequestModel({
        _id: req.body._id,
        marque: req.body.marque,
        modele: req.body.modele,
        dateMiseCirculation: req.body.dateMiseCirculation,
        carburant: req.body.carburant,
        boiteVitesse: req.body.boiteVitesse,
        kilometrage: req.body.kilometrage,
        email: req.body.email,
        telephone: req.body.telephone,
        tag: "Accepted",
        createdDate: req.body.createdDate
    });
     //   #region mail  
     let config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
  var transporter = nodemailer.createTransport(config);
  const info = await transporter.sendMail({
      from: 'myauto.noreply@gmail.com', 
      to: req.body.email, 
      subject: "Request accepted", 
      text: `Dear Client,\n Your request has been accepted successfully, request created at ${req.body.createdDate}.\n
      you will hear from us soon.
       Please contact our support team for further details. \n \n Best Regards, \n \n MyAuto support Team.`,
    })
    .then((result)=>{
      
      })
    .catch((error)=>{
        res.status(500).json({ error: error});

    })
  // #endregion mail
  
    RequestModel.updateOne({ _id: req.body._id}, requestToUpdate)
        .then(async (result) => {
            console.log("result", result);
          if (result.modifiedCount > 0) {
            //   #region mail  
            //   let config = {
            //       service: 'gmail',
            //       auth: {
            //           user: process.env.EMAIL,
            //           pass: process.env.PASSWORD
            //       }
            //   }
            // var transporter = nodemailer.createTransport(config);
            // const info = await transporter.sendMail({
            //     from: 'myauto.noreply@gmail.com', 
            //     to: requestToUpdate.email, 
            //     subject: "Request accepted", 
            //     text: `Dear Client,\n Your request has been accepted successfully, request created at ${requestToSave.createdDate}.\n
            //     you will hear from us soon.
            //      Please contact our support team for further details. \n \n Best Regards, \n \n MyAuto support Team.`,
            //   })
            //   .then((result)=>{
                
            //     })
            //   .catch((error)=>{
            //       res.status(500).json({ error: error});
    
            //   })
            // #endregion mail
            res.status(200).json({ message: "request accepted successful!" });
          } else {
            res.status(401).json({ message: "Not authorized!" });
          }
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
            message: "could not update the event!",
          });
        });
}
exports.deleteRequestById =  async (req, res, next) => {
    try {
        const requestId = req.body.requestId;
        const fetchedRequest = await RequestModel.findOne({_id: requestId });
        if(fetchedRequest.email?.length > 0 ){
            let config = {
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            }
            var transporter = nodemailer.createTransport(config);
            const info = await transporter.sendMail({
                from: 'myauto.noreply@gmail.com', 
                to: "oussema.benrejab@gmail.com", 
                subject: "Request from ", 
                text: "Dear Client, your request has been deleted, please contact our support team for further details",
              })
              .then((result)=>{
                
                })
              .catch((error)=>{
                  res.status(500).json({ error: error});
    
              })
        }
        RequestModel.deleteOne({ _id: requestId })
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
      } catch (err) {
        res.status(500).json({ error: err});
      }
    
}
exports.sendmail =  async (req, res, next) => {
    try {
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        }
        var transporter = nodemailer.createTransport(config);
        const info = await transporter.sendMail({
            from: 'myauto.noreply@gmail.com', // sender address
            to: "oussema.benrejab@gmail.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world?", // plain text body
            html: "<b>Hello world?</b>", // html body
          })
          .then((result)=>{
            res.status(200).json({ message: "Deletion successful!", info: result.messageId });
            })
          .catch((error)=>{
              res.status(500).json({ error: error});

          })
      } catch (err) {
        res.status(500).json({ error: err});
      }
}
