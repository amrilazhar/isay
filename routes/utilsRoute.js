const express = require("express");
const router = express.Router();

// IMPORT HERE
const utilsController = require("../controllers/utilsController");
const imageUpload = require("../middlewares/upload/images")

// SET ROUTER HERE
router.get("/location/", utilsController.getAllLocation);
router.get("/interest/:category", utilsController.getInterest);
router.post("/genProfile", utilsController.generateBasicProfile);

// // example image upload
// let dir = (req,res,next){
//     req.directory = "images/utils/";
//     next()
// }
// router.post("/testupload",dir, imageUpload, function (req,res){
//     console.log(req.images);
//     return res.status(200).json({images : req.images[0]})
// });

const interestController = require("../controllers/interestController");
// SET ROUTER INTEREST HERE
router.get("/getInterest", interestController.getAllInterest);
router.post("/createInterest", interestController.createInterest);
router.put("/updateInterest/:id", interestController.updateInterest);
router.delete("/deleteInterest/:id", interestController.deleteInterest);

module.exports = router;
