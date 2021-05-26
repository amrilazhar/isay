const mongoose = require("mongoose");
const { status, profile, interest, activities } = require("../models");

class ProfileController {
	//=====================|| my profile ||=================//
	async myProfile(req, res) {
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
			req.io.emit("my profile:" + dataProfile, dataProfile);

			res.status(200).json({
				success: true,
				message: "Success",
				data: dataProfile,
			});
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//=====================|| my profile post ||=================//
	async myProfilePost(req, res) {
		try {
			let paginateStatus = true;
			if (req.query.pagination) {
				if (req.query.pagination == "false") {
					paginateStatus = false;
				}
			}

			const options = {
				select: "content media comment likeBy",
				sort: { updated_at: -1 },
				page: 1,
				limit: 10,
				pagination: paginateStatus,
			};

			let dataProfile = await status.paginate(
				{ owner: req.profile.id },
				options
			);
			req.io.emit("my profile's post:" + dataProfile, dataProfile);
			res.status(200).json({
				success: true,
				message: "Success",
				data: dataProfile,
			});
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	//======================|| my profile activity ||====================//

	async myProfileActivities(req, res) {
		try {
			let paginateStatus = true;
			if (req.query.pagination) {
				if (req.query.pagination == "false") {
					paginateStatus = false;
				}
			}

			const options = {
				select: "activities_type status_id comment_id owner",
				sort: { updated_at: -1 },
				populate: {
					path: "status_id",
					select: "content owner media comment interest likeBy timestamps",
				},
				populate: {
					path: "comment_id",
					select: "content owner media comment likeBy timestamps",
				},
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
			console.log(err);
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
			req.io.emit("my friend profile:" + dataProfiles, dataProfiles);

			res.status(200).json({
				success: true,
				message: "Success",
				data: dataProfiles,
			});
		} catch (err) {
			console.log(err);
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
			console.log(err);
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
				select: "activities_type status_id comment_id owner",
				sort: { updated_at: -1 },
				populate: {
					path: "status_id",
					select: "content owner media comment interest likeBy timestamps",
				},
				populate: {
					path: "comment_id",
					select: "content owner media comment likeBy timestamps",
				},
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
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
	// =======================|| Update Profile ||================//
	async profileUpdate(req, res) {
		try {
			let profileData = {
				bio: req.body.bio,
				name: req.body.name,
				avatar: req.body.avatar ? req.body.avatar : "defaultAvatar.jpg",
				user: req.body.user,
				activities: req.body.activities,
				location: req.body.location,
			};

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
			req.io.emit("my profile update:" + dataProfile, dataProfile);
			res.status(200).json({
				success: true,
				message: "Update Profile Success",
				data: dataProfile,
			});
		} catch (err) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===========================|| add Interest ||========================//

	async addInterest(req, res) {
		try {
			let findUser = await profile.findOne({ _id: req.profile.id });
			findUser.interest.push(req.query.id_interest);

			let insertUser = await profile.findOneAndUpdate(
				{ _id: findUser._id },
				findUser,
				{ new: true }
			);
			if (!insertUser) {
				const error = new Error("Interest can't be added");
				error.statusCode = 400;
				throw error;
			} else
				res.status(200).json({
					success: true,
					message: "Add Interest Success",
					data: findUser,
				});
		} catch (e) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===========================|| delete Interest ||========================//
	async deleteInterest(req, res) {
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
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}

	//===========================|| List User Interest ||========================//

	async getListUserInterest(req, res) {
		try {
			let findUser = await profile
				.findOne({ _id: req.profile.id })
				.populate("interest");

			if (!findUser) {
				const error = new Error("Interest can't be added");
				error.statusCode = 400;
				throw error;
			} else
				res.status(200).json({
					success: true,
					message: "Get User Interest Success",
					data: findUser.interest,
				});
		} catch (e) {
			console.log(err);
			if (!err.statusCode) {
				err.statusCode = 500;
			}
			next(err);
		}
	}
}
module.exports = new ProfileController();
