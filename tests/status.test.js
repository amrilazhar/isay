const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const { user, comment, profile, status } = require("../models"); // import transaksi models

let authenticationToken = "0";
let temStatusID = "";
let tempInterestID = "";
let tempID = "";

describe("Status TEST", () => {
	//TODO-POST : create status/post
	describe("/POST Status", () => {
		test("It should return success", async () => {
			let interest_id = "6092b557e957671c70e24276";
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
					interest: interest_id,
					// media:,
				});

			expect(res.statusCode).toEqual(201);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body.success).toEqual(true);
		});
	});
	//TODO-GET : Get status/post by User
	describe("/GET/ Status by User", () => {
		it("it should return success", async () => {
			const res = await request(app)
				.get(`/status/users/`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body).toHaveProperty("data");
			expect(res.body.data).toBeInstanceOf(Object);
		});
	});
	//TODO-GET : Get status/post by interest (all)
	describe("/GET/ Status by Interest all", () => {
		it("it should return success", async () => {
			const res = await request(app)
				.get(`/status/interest/`)
				.set({
					Authorization: `Bearer ${authenticationToken}`,
				});
			expect(res.statusCode).toEqual(200);
			expect(res.body).toBeInstanceOf(Object);
			expect(res.body).toHaveProperty("data");
			expect(res.body.data).toBeInstanceOf(Object);
		});
	});

	//TODO-GET : Get status/post by interest (single)

	//TODO-PUT : Update status/post

	//TODO-PUT : Like Status/post : Record (Activities) : Record (Notification)

	//TODO-PUT : Unlike Status/post

	//TODO-GET : Loadmore Get Status/Post By User

	//TODO-GET : Loadmore Get Status/Post By Interest (all)

	//TODO-GET : Loadmore Get Status/Post By Interest (single)

	//TODO-GET : Get status/post by ID : No Pagination

	//TODO-DELETE : Delete status/post
});
