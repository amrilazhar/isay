const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const { user, comment, profile, status } = require("../models"); // import transaksi models

let authenticationToken = "0";
let tempStatusID;
let tempInterestID = "6092b557e957671c70e24277";
let tempProfileID;

describe("Status TEST", () => {
	//TODO-POST : create status/post
	describe("/POST Status", () => {
		//todo : if success
		test("It should return success", async () => {
			//drop and create table users
			await user.collection.dropIndexes();
			await user.deleteMany();
			await user.collection.createIndex({ email: 1 }, { unique: true });
			//delete comment
			await status.deleteMany();
			await profile.deleteMany();
			//create data profile
			const dataProfile = {
				bio: "new bio",
				location: "608f5baf87fc4f408c131780",
				interest: [
					"6092b557e957671c70e24276",
					"6092b557e957671c70e24277",
					"6092b557e957671c70e24278",
					"6092b557e957671c70e24279",
				],
				avatar: "http://dummyimage.com/167x100.png/ff4444/ffffff",
			};

			let userProfile = await profile.create(dataProfile);

			//create data user
			const dataUser = {
				email: "darwin@test.com",
				password: "Aneh1234!!",
				admin: false,
				emailVerified: true,
				profile: userProfile._id,
			};

			let userLogin = await user.create(dataUser);

			//generate token
			const token = jwt.sign(
				{
					id: userLogin._id,
					admin: userLogin.admin,
					profile: userProfile._id,
				},
				process.env.JWT_SECRET,
				{ expiresIn: "30d" }
			);

			//save token variable for later use
			authenticationToken = token;

			const res = await request(app)
				.post("/status")
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				})
				.send({
					content: "Anne with an E",
					interest: `${tempInterestID}`,
				});
			expect(res.statusCode).toEqual(201);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			tempStatusID = res.body?.data?._id;
			tempProfileID = userProfile._id;
		});
	});

	//TODO-GET : Get status/post by User
	describe("/GET/ Status by User", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.get(`/status/users/`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
	});

	//TODO-GET : Get status/post by interest (all)
	describe("/GET/ Status by Interest all", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.get(`/status/interest/`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
	});

	//TODO-GET : Get status/post by interest (single)
	describe("/GET/ Status by one Interest", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.get(`/status/interest/${tempInterestID}`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
	});

	//TODO-PUT : Update status/post [Not Complete]
	describe("/PUT/ Update Status", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.put(`/status/${tempStatusID}`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				})
				.send({
					content: "ku update komentar terbaru",
					owner: `${tempProfileID}`,
					interest: `${tempInterestID}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
	});

	//TODO-PUT : Like Status/post
	describe("/PUT/ like", () => {
		//todo : if success
		test("It should return success", async () => {
			const res = await request(app)
				.put(`/status/like/${tempStatusID}?likeBy=${tempProfileID}`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
	});

	//TODO-PUT : Unlike Status/pos
	describe("/PUT/ remove like", () => {
		//todo : if success
		test("It should return success", async () => {
			const res = await request(app)
				.put(`/status/unlike/${tempStatusID}?likeBy=${tempProfileID}`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
	});

	//TODO-GET : Loadmore Get Status/Post By User
	describe("/GET/ Load More Status by User", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.get(`/status/users/loadmore`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("success");
		});
	});

	//TODO-GET : Loadmore Get Status/Post By Interest (all)
	describe("/GET/ Load More Status by Interest all", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.get(`/status/interest/loadmore`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("success");
		});
	});

	//TODO-GET : Loadmore Get Status/Post By Interest (single)
	describe("/GET/ Load More Status by one Interest", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.get(`/status/interest/${tempInterestID}/loadmore`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("success");
		});
	});

	//TODO-GET : Get status/post by ID
	describe("/GET/ one status", () => {
		//todo : if success
		test("it should return success", async () => {
			const res = await request(app)
				.get(`/status/${tempStatusID}`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
		//todo : if failed
		test("it should return failed", async () => {
			const res = await request(app)
				.get(`/status/6092b557e957671c70e24277`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(400);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.message).toEqual("Status Data can't be appeared");
		});
	});

	//TODO-DELETE : Delete image
	// describe("/DELETE/ image on AWS and local", () => {
	// 	test("It should return success", async () => {
	// 		const res = await request(app)
	// 			.delete(
	// 				`/status/delim/${tempStatusID}?media=http://dummyimage.com/167x100.png/ff4444/ffffff.${tempProfileID}`
	// 			)
	// 			.set({
	// 				Authorization: `Bearer ${authenticationToken}`,
	// 			});
	// 		expect(res.statusCode).toEqual(200);
	// 		expect(res.body).toBeInstanceOf(Object);
	// 		expect(res.body.message).toEqual("Success");
	// 	});
	// });

	//TODO-DELETE : Delete status/post
	describe("/DELETE/ status", () => {
		//todo : if success
		test("It should return success", async () => {
			const res = await request(app)
				.delete(`/status/${tempStatusID}`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
			expect(res.body.message).toEqual("Success");
		});
	});
});
