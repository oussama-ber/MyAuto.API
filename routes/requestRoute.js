const express = require("express");

const requestController = require("../controllers/RequestController"); 
const imageController = require("../controllers/testImage"); 
const router = express.Router();

router.get("",requestController.getRequests);
router.get("/sendmail",requestController.sendmail); //testing
router.post("/saveImage",imageController.saveImage); //testing
router.put("/acceptRequest",requestController.acceptRequest);
router.post("/saveRequest",requestController.saveRequest);
router.post("/deleteRequestById",requestController.deleteRequestById);

module.exports = router;