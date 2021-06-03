const mongoose = require("mongoose");
const { status, profile, interest, activities, funfact } = require("../models");

class ProfileController {
	//=====================|| my profile ||=================//
	async myProfile(req, res, next) {
		try {
			//find user id
			let dataProfile = await profile
				.findOne({ _id: req.profile.id })
				.populate({
					path: "interest",
					select: "interest category",
				})
				.populate({
					path: "location",
					select: "province city_type city country",
				})
				.exec();

			let funfacts = await funfact.find({}).populate("interest").exec();

			if (funfacts) {
				let randomNum = Math.floor(Math.random() * funfacts.length);
				dataProfile._doc.funfacts = funfacts[randomNum];
			} else {
				dataProfile._doc.funfacts = "sorry we are currently searching for it";
			}

			if (!dataProfile._doc.backgroundImage) {
				dataProfile._doc.backgroundImage = `${process.env.S3_URL}images/background_profile_isay.jpeg`;
			}				

			res.status(200).json({
				success: true,
				message: "Success",
				data: dataProfile,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//=====================|| my profile post ||=================//
	async myProfilePost(req, res, next) {
		try {
			let paginateStatus = true;
			if (req.query.pagination) {
				if (req.query.pagination == "false") {
					paginateStatus = false;
				}
			}

			const options = {
				sort: { created_at: -1 },
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{ path: "owner", populate: "location" },
					{ path: "interest", select: "interest category" },
				],
				pagination : paginateStatus,
			};

			let dataProfile = await status.paginate(
				{ owner: req.profile.id },
				options
			);

			res.status(200).json({
				success: true,
				message: "Success",
				data: dataProfile,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	//======================|| my profile activity ||====================//

	async myProfileActivities(req, res, next) {
		try {
			let paginateStatus = true;
			if (req.query.pagination) {
				if (req.query.pagination == "false") {
					paginateStatus = false;
				}
			}

			const options = {
				select: "type status_id comment_id owner created_at",
				sort: { created_at : -1 },
				// lean : true,
				populate: [
					{
						path: "status_id",
						select: "content media comment likeBy created_at",
						populate: [
							{ path: "owner", select: "name avatar", populate: "location" },
							{ path: "interest" },
						],
					},
					{
						path: "comment_id",
						select: "content owner media comment likeBy created_at",
					},
				],
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 8,
				pagination: paginateStatus,
			};

			let dataProfile = await activities.paginate(
				{ owner: req.profile.id },
				options
			);

			res.status(200).json({
				success: true,
				message: "Success",
				data: dataProfile,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//=====================|| view another profile ||=================//
	async anotherProfile(req, res, next) {
		try {
			//find user id
			let dataProfiles = await profile
				.findOne({ _id: req.params.id })
				.populate({
					path: "interest",
					select: "interest category",
				})
				.populate({
					path: "location",
					select: "province city_type city country",
				})
				.exec();

			let funfacts = await funfact.find({}).populate("interest").exec();

			if (funfacts) {
				let randomNum = Math.floor(Math.random() * funfacts.length);
				dataProfiles._doc.funfacts = funfacts[randomNum];
			} else {
				dataProfiles._doc.funfacts = "sorry we are currently searching for it";
			}

			if (!dataProfiles._doc.backgroundImage) {
				dataProfiles._doc.backgroundImage = `${process.env.S3_URL}images/background_profile_isay.jpeg`;
			}
			res.status(200).json({
				success: true,
				message: "Success",
				data: dataProfiles,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//=====================|| my profile post ||=================//
	async anotherProfilePost(req, res, next) {
		try {
			const options = {
				sort: { created_at: -1 },
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 8,
				populate: [
					{ path: "owner", populate: "location" },
					{ path: "interest", select: "interest category" },
				],
			};

			let statusUsers = await status.paginate(
				//search key
				{ owner: req.params.id },
				//pagination setting
				options
			);

				//restruktur data mongoose paginate
				let returnData = { ...statusUsers, data: statusUsers.docs };
				delete returnData.docs;

			res.status(200).json({
				success: true,
				message: "Success",
				...returnData,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	//======================|| my profile activity ||====================//

	async anotherProfileActivities(req, res, next) {
		try {
			let paginateStatus = true;
			if (req.query.pagination) {
				if (req.query.pagination == "false") {
					paginateStatus = false;
				}
			}

			const options = {
				select: "type status_id comment_id owner created_at",
				sort: { created_at : -1 },
				populate: [
					{
						path: "status_id",
						select: "content media comment likeBy created_at",
						populate: [
							{ path: "owner", select: "name avatar", populate: "location" },
							{ path: "interest" },
						],
					},
					{
						path: "comment_id",
						select: "content owner media comment likeBy created_at",
					},
				],
				page: req.query.page ? (req.query.page < 20 ? req.query.page : 20) : 1,
				limit: req.query.limit ? req.query.limit : 8,
				pagination: paginateStatus,
			};

			let dataActivities = await activities.paginate(
				{ owner: req.params.id },
				options
			);
			//restruktur data mongoose paginate
			let returnData = { ...dataActivities, data: dataActivities.docs };
			delete returnData.docs;

			res.status(200).json({
				success: true,
				message: "Success",
				...returnData,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	// =======================|| Update Profile ||================//
	async profileUpdate(req, res, next) {
		try {
			let profileData = {
				bio: req.body.bio,
			};

			if (req.body.location) {
				profileData.location = req.body.location;
			}

			if(req.images && req.images.length > 0) {
				profileData.backgroundImage = req.images[0];
			}

			let dataProfile = await profile.findOneAndUpdate(
				{ _id: req.profile.id },
				profileData,
				{ new: true }
			);

			if (!dataProfile) {
				const error = new Error("Data user can't be appeared");
				error.statusCode = 400;
				throw error;
			}

			res.status(200).json({
				success: true,
				message: "Update Profile Success",
				data: dataProfile,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===========================|| add Interest ||========================//

	async addInterest(req, res, next) {
		try {
			let findUser = await profile.findOne({ _id: req.profile.id });
			findUser.interest.push(req.query.id_interest);

			let insertUser = await profile.findOneAndUpdate(
				{ _id: findUser._id },
				findUser,
				{ new: true }
			);

				res.status(200).json({
					success: true,
					message: "Add Interest Success",
					data: findUser,
				});
		} catch (e) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===========================|| delete Interest ||========================//
	async deleteInterest(req, res, next) {
		try {
			let findUser = await profile.findOne({ _id: req.profile.id });
			let indexOfInterest = findUser.interest.indexOf(req.query.id_interest);
			if (indexOfInterest < 0) {
				const error = new Error("Interest name has not been added at Interest");
				error.statusCode = 400;
				throw error;
			} else {
				findUser.interest.splice(indexOfInterest, 1);
			}
			let deleteInterest = await profile.findOneAndUpdate(
				{ _id: findUser._id },
				findUser,
				{ new: true }
			);
			let userInterest = deleteInterest.interest;
			if (userInterest == 0) {
				res.status(400).json({
					success: true,
					message: "Interest is empty",
					data: null,
				});
			}
			res.status(200).json({
				success: true,
				message: "Delete interest Success",
				data: findUser,
			});
		} catch (e) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===========================|| List User Interest ||========================//

	async getListUserInterest(req, res, next) {
		try {
			let findUser = await profile
				.findOne({ _id: req.profile.id })
				.populate("interest");

				res.status(200).json({
					success: true,
					message: "Get User Interest Success",
					data: findUser.interest,
				});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	async changeAvatar(req, res, next) {
		try {
			let { avatarPic } = require("../training/dataList");
			let choosenAvatar = req.params.avatar
				? req.params.avatar > avatarPic.length || req.params.avatar < 0
					? Math.floor(Math.random() * (avatarPic.length - 1))
					: req.params.avatar
				: Math.floor(Math.random() * (avatarPic.length - 1));

			let setProfilePic = await profile.findOneAndUpdate(
				{ _id: mongoose.Types.ObjectId(req.profile.id) },
				{ avatar: avatarPic[choosenAvatar] },
				{ new: true }
			);

			if (setProfilePic) {
				res.status(200).json({
					success: true,
					message: "Profile Avatar Changed",
					avatar: avatarPic[choosenAvatar],
					data: setProfilePic,
				});
			}
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	getAvatarList(req, res, next) {
		try {
			let { avatarPic } = require("../training/dataList");
			res.status(200).json({
				success: true,
				message: "Avatar List",
				data: avatarPic,
			});
		} catch (err) {
			
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
}
module.exports = new ProfileController();
