// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const multer = require("multer");

// router.post("/", (req, res) => {

// upload.single("file")(req, res, function(err){

// // handle multer errors
// if(err instanceof multer.MulterError){
// return res.status(400).json({
// error: "Multer error",
// details: err.message
// });
// }

// // handle unknown errors
// if(err){
// return res.status(500).json({
// error: "Upload failed",
// details: err.message
// });
// }

// // if file missing
// if(!req.file){
// return res.status(400).json({
// error: "No file uploaded"
// });
// }

// const fileUrl =
// "http://localhost:5000/uploads/" + req.file.filename;

// res.json({
// fileUrl
// });

// });

// });

// module.exports = router;