const { interest, location, funfact } = require("../models");
const file = require("fs");
const brain = require("brain.js");

class UtilsController {
	async getAllLocation(req, res) {
		try {
			//get data from database
			let dataLoc = await location.find().exec();

			//check if data empty
			if (!dataLoc) {
				const err = new Error("Data Location Empty");
				err.statusCode = 400;
				throw err;
			}

			//send data
			return res
				.status(200)
				.json({ success: true, message: "success", data: dataLoc });
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
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
			if (!dataLoc) {
				const err = new Error("Data Interest Empty");
				err.statusCode = 400;
				throw err;
			}

			//send data
			return res
				.status(200)
				.json({ success: true, message: "success", data: dataLoc });
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}

	async generateBasicProfile(req, res, next) {
		try {
			//create parameter for generate name
			let genderParam = Math.floor(Math.random() * 2);
			let randN = Math.floor(Math.random() * 2);
			const {
				greeting,
				charName,
				listInterest,
				listProvince,
				avatarPic,
			} = require("../training/dataList.js");
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
				let interestAll = await interest.find({}).exec();
				let interestParam = JSON.parse(req.body.interest);
				let interestCont = [];

				interestParam.forEach((element) => {
					let idx = interesAll.indexOf(element);
					if (idx > -1) {
						interestCont.push(interestAll[idx]);
					}
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
			let randomNum = Math.floor(Math.random() * 12);

			//generate Name
			let tempN = nama.run({
				g: genderParam,
				n: randN,
				i: interestOne,
				ii: interestTwo,
				iii: interestThree,
			});
			let tempS = sapaan.run({ g: genderParam, p: province });
			console.log(
				Math.floor(tempS.sapa * 100),
				" ",
				Math.floor(tempN.name * 1000)
			);
			const generatedName = `${greeting[Math.floor(tempS.sapa * 100)]}.${
				charName[Math.floor(tempN.name * 1000)]
			}.#${Math.floor(Math.random() * 9999)}`;

			//set avatar
			let avatar = avatarPic[randomNum];

			//selecting fun fact
			req.body.funfact = (await funfact.find({}).populate("interest").exec())[
				randomNum
			];

			req.body.name = generatedName;
			req.body.avatar = avatar;
			next();
		} catch (error) {
			console.log(error);
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}
}

module.exports = new UtilsController();
