const express = require("express");

const carController = require("../controllers/CarController"); 
const entretienController = require("../controllers/EntretienController"); 
const router = express.Router();

router.get("",carController.getCars);
router.get("/getLatestCars",carController.getLatestCars);
router.post("/saveCar",carController.SaveCar);
router.post("/getCarDetailsById",carController.getCarDetailsById);
router.post("/updateCarDate",carController.UpdateCarDate);
// entretien
router.post("/getEntretiensByCarId",entretienController.getEntretien);
router.post("/saveEntretien",entretienController.saveEntretien);

module.exports = router;