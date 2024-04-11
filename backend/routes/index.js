const express = require("express");
const router = express.Router();
const {loadToBigQuery, uploadFile, addRow, deleteRow} = require("../controllers/medical_controller");
const upload = require("../utils/multer");

router.post("/upload", upload.single("file"), uploadFile);
router.post("/bigquery", loadToBigQuery)
router.post("/add", addRow);
router.delete('/delete', deleteRow);

module.exports = router;