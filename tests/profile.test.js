const { users, profile, movie, review } = require("../models");
const User = require("../models/users");
const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

let authenticationToken = "";
let tempID ;
let emailVerified = true
let invalidToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjA3OGZjNGZjMWJjMjA3Nzc3ZTc4Nzk4IiwiZW1haWwiOiJ1c2VyMUBnbGludHNtYWlsLmNvbSJ9LCJpYXQiOjE2MTkyNTI5NDcsImV4cCI6MTYxOTg1Nzc0N30.c3KzbMZIPJXUGhHrQ_xeVSxT4AlSN3JVMOio0Pbz4K8";

// ======================|| Create User and get profile||======================= */

describe("|| GET Profile Success ||", () => {
	it("it should GET profile of user ", async () => {
		await users.collection.dropIndexes();
		await users.deleteMany();
		await users.collection.createIndex();

		const user = new User({
			email: "jhorgijelek@sad.com",
			password: "NowOrNever123!!",
			firstName: "Mighty",
			lastName: "Osiris",
			// photoUrl: imageUrl,
			emailToken: generateToken(),
			emailExpiration: Date.now() + 3600000,
		});

		await user.save();

		// TODO SEND E-MAIL
    	tempID = user.id;
    
		console.log(users.emailToken);
		//create token for auth as user
		const token = jwt.sign(
			{
				id: user._id.toString(),
				admin: user.admin,
			},
			process.env.JWT_SECRET,
			{ expiresIn: "30d" }
		);

		// save token for later use
		authenticationToken = token;

		const res = await request(app)
			.get(`/profile/getProfile/${tempID}`)
			.set({
				Authorization: `Bearer ${authenticationToken}`,
			});

		expect(res.statusCode).toEqual(200);
		expect(res.body.message).toEqual("Success");
		expect(res.body.data).toBeInstanceOf(Object);
	});
});
