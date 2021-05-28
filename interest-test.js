
// const request = require("supertest");
// const app = require("../index");

// const interest= require("../models/interest.js"); 

// let tempInt = "0"

// //===============================|| create interest ||=========================//

//   describe("/POST create Interest", () => {
//     test("It should return success", async () => {
//       const res = await request(app)
//         .post(`/createInterest`)
//         .send({
//             interest: "Something",
//             category: `Something`,
//           });
 
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toBeInstanceOf(Object);
//       expect(res.body.success).toEqual(true);
//       expect(res.body.message).toEqual("Success");

//       tempInt = res.body.data._id
//     });
//   });

//   //===============================|| get all interest ||=========================//
// describe("/GET all interest", () => {
//     test("It should return success", async () => {
//       const res = await request(app)
//         .get(`/getInterest`)

//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toBeInstanceOf(Object);
//       expect(res.body.success).toEqual(true);
//       expect(res.body.message).toEqual("Success");
//     });
//   });

// //===============================|| edit interest ||=========================//

//   describe("/PUT edit Interest", () => {
//     test("It should return success", async () => {
//       const res = await request(app)
//         .put(`/updateInterest/${tempInt}`)
//         .send({
//             interest: "Somebody",
//             category: `Somebody`,
//           });
 
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toBeInstanceOf(Object);
//       expect(res.body.success).toEqual(true);
//       expect(res.body.message).toEqual("Success");
//     });
//   });

// //===============================|| delete interest ||=========================//

//   describe("/DELETE delete Interest", () => {
//     test("It should return success", async () => {
//       const res = await request(app)
//         .put(`/deleteInterest/${tempInt}`)
 
//       expect(res.statusCode).toEqual(200);
//       expect(res.body).toBeInstanceOf(Object);
//       expect(res.body.success).toEqual(true);
//       expect(res.body.message).toEqual("Success");
//     });
//   });