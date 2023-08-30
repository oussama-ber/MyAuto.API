const express = require("express");

const requestController = require("../controllers/RequestController"); 
const router = express.Router();

router.get("",requestController.getRequests);
router.post("/saveRequest",requestController.saveRequest);
router.post("/deleteRequestById",requestController.deleteRequestById);

module.exports = router;