const express = require("express");
const router = express.Router();
const {getPaginatedData, getTopThreeMedications, getMostCommonBloodType, getMostCommonMedicalCondition, getAverageBillingAmount, searchRecords,} = require("../controllers/dashboard_controller");

router.get("/data/:page", getPaginatedData);
router.get("/medications", getTopThreeMedications);
router.get("/blood-types", getMostCommonBloodType)
router.get("/medical-condition", getMostCommonMedicalCondition);
router.get("/billing", getAverageBillingAmount);
router.get("/search/:name", searchRecords);

module.exports = router;