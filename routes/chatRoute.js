const express = require("express");
const router = express.Router();

// IMPORT HERE 
const chatController = require("../controllers/chatController");

// SET ROUTER HERE
router.get('/send', (req,res)=>{
    res.status(200).send({response : "test"});
})


module.exports = router;