const { interest, location } = require("../models");
const file = require("fs");
const brain = require("brain.js");

class UtilsController {
  async getAllLocation(req, res) {
    try {
      //get data from database
      let dataLoc = await location.find().exec();

      //check if data empty
      if (!dataLoc) return res.status(400).json({ message: "data empty" });

      //send data
      return res.status(200).json({ message: "success", data: dataLoc });
    } catch (error) {
      return res.status(500).json({ message: "internal server error" });
    }
  }

  async getInterest(req, res) {
    try {
      // set category to all or to specific
      let category =
        req.params.category.toLowerCase() === "all"
          ? {}
          : { category: req.params.category };
      //get data from database
      let dataLoc = await interest.find(category).exec();

      //check if data empty
      if (!dataLoc) return res.status(400).json({ message: "data empty" });

      //send data
      return res.status(200).json({ message: "success", data: dataLoc });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }

  async generateBasicProfile(req, res) {
    try {
      //create parameter for generate name
      let genderParam = Math.floor(Math.random() * 2);
      let randN = Math.floor(Math.random() * 2);
      const {
        greeting,
        charName,
        listInterest,
        listProvince,
      } = require("../training/listName.js");
      let province = 0.07;
      let interestOne = 0;
      let interestTwo = 0;
      let interestThree = 0;

      //convert location to number that can be use by model
      if (!req.body.location) {
        let locationParam = await location.findById(locationParam);
        province = listProvince.indexOf(locationParam.province) / 100;
      }

      //convert interest to number that can be use by model
      if (!req.body.interest) {
        let interestParam = JSON.parse(req.body.interest);
        let interestCont = [];

        interestParam.forEach(async (element) => {
          let item = await interest.findById(element);
          interestCont.push(item);
        });

        interestOne = interestCont[0]
          ? listInterest.indexOf(interestCont[0].interest) / 100
          : 0;
        interestTwo = interestCont[1]
          ? listInterest.indexOf(interestCont[1].interest) / 100
          : 0;

        if (interestCont.length > 3) {
          let randInterest = Math.floor(Math.random() * interestCont.length);
          let idx = randInterest < 2 ? irandInterest + 2 : randInterest;
          interestThree = interestCont[idx]
            ? listInterest.indexOf(interestCont[idx].interest) / 100
            : 0;
        } else
          interestThree = interestCont[2]
            ? listInterest.indexOf(interestCont[2].interest) / 100
            : 0;
      }

      //initialize brain
      const sapaan = new brain.NeuralNetwork();
      const nama = new brain.NeuralNetwork();

      // get trained model from file
      let jsonSapaan = file.readFileSync("./training/sapaan.json", "utf8");
      let jsonNama = file.readFileSync("./training/username.json", "utf8");

      //load trained model to brain JS
      sapaan.fromJSON(JSON.parse(jsonSapaan));
      nama.fromJSON(JSON.parse(jsonNama));
      //generate random avatar
      let randomTen = Math.floor(Math.random() * 10);

      //generate Name
      let tempN = nama.run({
        g: genderParam,
        n: randN,
        i: interestOne,
        ii: interestTwo,
        iii: interestThree,
      });
      let tempS = sapaan.run({ g: genderParam, p: province });
      console.log(Math.floor(tempS.sapa * 100)," ", Math.floor(tempN.name * 1000));
      const generatedName = `${greeting[Math.floor(tempS.sapa * 100)]}.${
        charName[Math.floor(tempN.name * 1000)]}.#${Math.floor(Math.random()*9999)}`;

      let avatar = "https://robohash.org/avatar" + randomTen;

      return res.status(200).json({ name: generatedName, avatar: avatar });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "internal server error" });
    }
  }
}

module.exports = new UtilsController();
