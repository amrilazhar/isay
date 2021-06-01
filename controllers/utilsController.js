const { interest, location, funfact } = require("../models");
const file = require("fs");

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
			//import decision Tree 
			let DecisionTree = require("decision-tree");

			//create parameter for generate name
			let gender = ["pria", "wanita"];
			let dateCreatedStatus =
				new Date().getDate() % 2 === 0 ? "genap" : "ganjil";
			let genderParam = Math.floor(Math.random() * 2) % 2;
			const {
				avatarPic,
				nameType
			} = require("../training/dataList.js");
			let province = "Jawa Timur";
			let interestOne = "";
			let interestTwo = "";
			let interestThree = "";

			//get province name from database based on location ID
			if (!req.body.location) {
				let locationParam = await location.findById(locationParam);
				province = locationParam.province;
			}

			//get interest name from database based on location ID
			if (req.body.interest) {
				let interestAll = await interest.find({}).exec();
				let interestParam = JSON.parse(req.body.interest);
				let interestCont = [];
				
				interestParam.forEach((element) => {
					interestAll.forEach(item=>{
						if (item._id == element) {
							interestCont.push(item)
						}						
					})
				});

				interestOne = interestCont[0] ? interestCont[0].interest : "";
				interestTwo = interestCont[1] ? interestCont[1].interest : "";

				if (interestCont.length > 3) {
					let randInterest = Math.floor(Math.random() * interestCont.length);
					let idx = randInterest < 2 ? randInterest + 2 : randInterest;
					interestThree = interestCont[idx] ? interestCont[idx].interest : "";
				} else interestThree = interestCont[2] ? interestCont[2].interest : "";
			}

			// get preTrained model from file
			let jsonSapaan = JSON.parse(
				file.readFileSync("./training/sapaanDtree.json", "utf8")
			);
			let jsonName = JSON.parse(
				file.readFileSync("./training/nameDtree.json", "utf8")
			);

			//load trained model to DecisionTree
			let namaSapaanDTree = new DecisionTree(jsonSapaan);
			let namaCharDTree = new DecisionTree(jsonName);

			//generate random avatar
			let randomNum = Math.floor(Math.random() * 12);


			//generate Name
			let objName = {
				name_type : nameType[Math.floor(Math.random()*nameType.length)],
				gender: gender[genderParam],
				datecreated: dateCreatedStatus,
				interest1: interestOne,
				interest2: interestTwo,
				interest3: interestThree,
			}
			let namaChar = namaCharDTree.predict(objName);

			let namaSapaan = namaSapaanDTree.predict({
				provinsi: province,
				gender: gender[genderParam],
			});

			const generatedName = `${namaSapaan}.${namaChar}.#${Math.floor(
				Math.random() * 9999
			)}`;

			//set avatar
			let avatar = avatarPic[randomNum];

			//selecting fun fact
			let funfacts = await funfact.find({}).populate("interest").exec();

			if (funfacts) {
				let randomNum = Math.floor(Math.random() * funfacts.length);
				req.body.funfact = funfacts[randomNum];
			} else req.body.funfact = "sorry we are currently searching for it";

			req.body.name = generatedName;
			req.body.avatar = avatar;
			next();
		} catch (error) {
			if (!error.statusCode) {
				error.statusCode = 500;
			}
			next(error);
		}
	}
}

module.exports = new UtilsController();
