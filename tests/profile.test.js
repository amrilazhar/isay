const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const { user, comment, profile } = require("../models"); // import transaksi models

let authenticationToken = "0";
let tempID = "";
let tempProfile = "608ac628c8d0a1bfded19469";
let tempProfileTwo = "60935f673fba7223585128d1";
let tempUserTwo = "60af9109e8f9c90029a29f08"


describe("Utils TEST", () => {
  describe("/Get All Location ", () => {
    test("It should return success", async () => {
      const res = await request(app).get("/utils/location");
      // .set({
      //   Authorization: `Bearer ${authenticationToken}`,
      // })

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("success");
    });
  });

  describe("/GET  Interest by Category", () => {
    test("It should return success", async () => {
      const res = await request(app).get(`/utils/interest/topic`);
      // .set({
      //   Authorization: `Bearer ${authenticationToken}`,
      // });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("success");
    });
  });

  // describe("/POST Comment ", () => {
  //   test("It should return success", async () => {
  //     let status_id = "6093967f3fba722358512955";

  //     //drop and create table users
  //     await user.collection.dropIndexes();
  //     await user.deleteMany();
  //     await user.collection.createIndex({ email: 1 }, { unique: true });

  //     //delete comment
  //     //delete profile
  //     await comment.deleteMany();
  //     await profile.deleteMany();

  //     //create data profile
  //     const dataProfile = {
  //       bio: "new bio",
  //       location: "608f5baf87fc4f408c131780",
  //       interest: [
  //         "6092b557e957671c70e24276",
  //         "6092b557e957671c70e24277",
  //         "6092b557e957671c70e24278",
  //         "6092b557e957671c70e24279",
  //       ],
  //       avatar: "http://dummyimage.com/167x100.png/ff4444/ffffff",
  //     };

  //     let userProfile = await profile.create(dataProfile);
  //     userProfile._id = tempProfile;

  //     //create data user
  //     const dataUser = {
  //       email: "isayjhorgi@test.com",
  //       password: "Aneh1234!!",
  //       admin: false,
  //       emailVerified: true,
  //       profile: userProfile._id,
  //     };

  //     let userLogin = await user.create(dataUser);

  //     //generate token
  //     const token = jwt.sign(
  //       {
  //         id: userLogin._id,
  //         admin: userLogin.admin,
  //         profile: userProfile._id,
  //       },
  //       process.env.JWT_SECRET,
  //       { expiresIn: "30d" }
  //     );

  //     //save token variable for later use
  //     authenticationToken = token;

  //     const res = await request(app)
  //       .post("/comment")
  //       .set({
  //         Authorization: `Bearer ${authenticationToken}`,
  //       })
  //       .send({
  //         content: "Anne with an E",
  //         status_id: status_id,
  //         depth: 1,
  //       });

  //     expect(res.statusCode).toEqual(200);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body.success).toEqual(true);
  //     //save id movie
  //     tempCommentID = res.body.data._id;
  //   });
  // });
});

// //Test get profile
// describe("/GET Profile", () => {
//   test("It should return success", async () => {
//     const res = await request(app)
//       .post("/comment/getProfile/608ac628c8d0a1bfded19469")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body.success).toEqual(true);
//   });
// });

// // make a status
// describe("/POST dummy status", () => {
//   test("It should return success", async () => {
//     const res = await request(app)
//       .post("/status")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       })
//       .send({
//         content: "Anne with an E",
//         interest: "6092b557e957671c70e24279",
//         // media:,
//       });

//     expect(res.statusCode).toEqual(201);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body.success).toEqual(true);
//   });
// });
// //Tes get profile post
// describe("/GET Profile's post", () => {
//   test("It should return success", async () => {
//     const res = await request(app)
//       .get("/Post")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body.success).toEqual(true);
//   });
// });

// //Tes get profile activities
// describe("/GET Profile's activities", () => {
//   test("It should return success", async () => {
//     const res = await request(app)
//       .get("/Activities")
//       .set({
//         Authorization: `Bearer ${authenticationToken}`,
//       });

//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toBeInstanceOf(Object);
//     expect(res.body.success).toEqual(true);
//   });
// });




//view another profile
// describe("/GET another Profile's activities", () => {
// 	test("It should return success", async () => {

// 	        //create data profile
// 			const dataProfileTwo = {
// 				bio: "new bio",
// 				location: "608f5baf87fc4f408c131780",
// 				interest: [
// 				  "6092b557e957671c70e24276",
// 				  "6092b557e957671c70e24277",
// 				  "6092b557e957671c70e24278",
// 				  "6092b557e957671c70e24279",
// 				],
// 				avatar: "http://dummyimage.com/167x100.png/ff4444/ffffff",
// 			  };
		
// 			  let userProfileTwo = await profile.create(dataProfileTwo);
// 			  userProfileTwo._id = tempProfileTwo;
		
// 			  //create data user
// 			  const dataUserTwo = {
// 				email: "isayjhorgi@test.com",
// 				password: "Aneh1234!!",
// 				admin: false,
// 				emailVerified: true,
// 				profile: userProfile._id,
// 			  };
		
// 			  let userLoginNew = await user.create(dataUserTwo);
// 			  userLoginNew._id = tempUserTwo;

// 			  const statusDummy = {
// 				content: "yahooo !!"
// 				owner: ""
// 			  }
// 			  const res = await request(app)
// 			  .get("/an/Activities")
// 			  .set({
// 				Authorization: `Bearer ${authenticationToken}`,
// 			  });
		
// 			expect(res.statusCode).toEqual(200);
// 			expect(res.body).toBeInstanceOf(Object);
// 			expect(res.body.success).toEqual(true);
// 		  });
// 		});
		