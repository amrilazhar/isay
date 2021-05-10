const request = require("supertest");
const app = require("../index");

let authenticationToken = "0";
let tempID = "";

describe("Utils TEST", () => {

  describe("/Get All Location ", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .get("/utils/location")
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
      const res = await request(app)
        .get(`/utils/interest/topic`)
        // .set({
        //   Authorization: `Bearer ${authenticationToken}`,
        // });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("success");
    });
  });

});
