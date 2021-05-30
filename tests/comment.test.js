const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const { user, comment, profile, status } = require("../models"); // import transaksi models

let authenticationTokenTwo = "1";
let tempStatus = "6093967f3fba722358512955";
let tempProfile = "60b0af790d1bf101446e25ec";
let tempLogin = "60b09064c6cd100e28513003";
let tempComment = "60b09064c6cd100e28513045";

//===============================|| get all comment but data comment is 0 and make user||=========================//
describe("Comment TEST", () => {
  describe("/GET Comment", () => {
    test("It should return success", async () => {
      //create data profile

      //drop and create table users
      await user.collection.dropIndexes();
      await user.deleteMany();
      await user.collection.createIndex({ email: 5 }, { unique: true });

      //delete comment
      //delete profile
      await profile.deleteMany();

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
      tempProfile = userProfile._id;
      //create data user
      const dataUser = {
        email: "isaynami@test.com",
        password: "Aneh1234!!",
        admin: false,
        emailVerified: true,
        profile: userProfile._id,
      };

      let userLogin = await user.create(dataUser);
      tempLogin = userLogin._id;
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
      authenticationTokenTwo = token;

      const res = await request(app)
        .get(`/comment/`)
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Not found");
    });
  });

  //===============================|| post comment (error 1) ||=========================//
  describe("/POST Comment", () => {
    describe("It should return failed", () => {
      it("[Error] Status id not valid", async () => {
        const res = await request(app)
          .post("/comment/")
          .set({
            Authorization: `Bearer ${authenticationTokenTwo}`,
          })
          .send({
            content: "Anne with an E",
            status_id: `60935f673fba72235851`,
            owner: `${tempProfile}`,
            depth: 1,
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Status id not valid");
      });
    });
  });
  //===============================|| post comment ||=========================//
  describe("/POST Comment", () => {
    test("It should return success", async () => {
      const dataStatus = {
        content: "Anne with an E",
        interest: "6092b557e957671c70e24279",
        owner: "60935f673fba7223585128d1",
        comment: [],
      };

      let dummyStatus = await status.create(dataStatus);
      tempStatus = dummyStatus._id;

      const res = await request(app)
        .post("/comment/")
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        })
        .send({
          content: "Anne with an E",
          status_id: `${tempStatus}`,
          owner: `${tempProfile}`,
          depth: 1,
          likeBy: [],
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);

      tempComment = res.body.data._id;
    });
  });

  //===============================|| get all comment but not null ||=========================//
  describe("/GET all comment from status ID", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .get(`/comment/?status_id=${tempStatus}`)
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Success");
    });
  });

  //===============================|| get one  comment ||=========================//
  describe("/GET one comment", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .get(`/comment/${tempComment}`)
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Success");
    });
  });

  //===============================|| update comment (error 1) ||=========================//
  describe("/PUT update comment", () => {
    describe("It should return failed", () => {
      test("[Error] id profile is not valid and must be 24 character & hexadecimal", async () => {
        const res = await request(app)
          .put(`/comment/6092b557e957671c70e2427`)
          .set({
            Authorization: `Bearer ${authenticationTokenTwo}`,
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Comment is not found");
      });
    });
  });

  //===============================|| update comment ||=========================//
  describe("/PUT update comment", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .put(`/comment/${tempComment}`)
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        })
        .send({
          content: "ku update komentar terbaru",
          owner: `${tempProfile}`,
          media: "http://dummyimage.com/167x100.png/ff4444/ffffff",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Update comment Success");
    });
  });

  //===============================|| delete image on put method (error 1) ||=========================//
  describe("/DELETE image on AWS and local", () => {
    describe("It should return failed", () => {
      test("[Error] delete can't be processes", async () => {
        const res = await request(app)
          .delete(`/comment/delim/${tempComment}?media=uidfha8df8afyd8`)
          .set({
            Authorization: `Bearer ${authenticationTokenTwo}`,
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("delete can't be processes");
      });
    });
  });

  //===============================|| delete image on put method ||=========================//
  describe("/DELETE image on AWS and local", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .delete(
          `/comment/delim/${tempComment}?media=http://dummyimage.com/167x100.png/ff4444/ffffff.${tempProfile}`
        )
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.message).toEqual("Success");
    });
  });

  //===============================|| add like (error 1) ||=========================//
  describe("/PUT Add Like", () => {
    describe("It should return failed", () => {
      test("[Error] Comment is not found", async () => {
        const res = await request(app)
          .put(`/comment/addLike/6092b557e957671c70e242`)
          .set({
            Authorization: `Bearer ${authenticationTokenTwo}`,
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Comment is not found");
      });
    });
  });

  //===============================|| add like ||=========================//

  describe("/PUT Add Like", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .put(`/comment/addLike/${tempComment}?likeBy=${tempProfile}`)
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Success");
    });
  });

  //===============================|| add like (error 1)||=========================//

  describe("/PUT Add Like", () => {
    describe("It should return failed", () => {
      test("[Error] You can't like twice", async () => {
        const res = await request(app)
          .put(`/comment/addLike/${tempComment}?likeBy=${tempProfile}`)
          .set({
            Authorization: `Bearer ${authenticationTokenTwo}`,
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("You can't like twice");
      });
    });
  });

  //===============================|| remove like (error 1) ||=========================//
  describe("/PUT remove like", () => {
    describe("It should return failed", () => {
      test("[Error] Comment is not found", async () => {
        const res = await request(app)
          .put(`/comment/6092b557e957671c70e2427`)
          .set({
            Authorization: `Bearer ${authenticationTokenTwo}`,
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Comment is not found");
      });
    });
  });
  //===============================|| remove like ||=========================//
  describe("/PUT remove like", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .put(`/comment/removeLike/${tempComment}?likeBy=${tempProfile}`)
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Success");
    });
  });

  //===============================|| delete comment ||=========================//
  describe("/DELETE one comment", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .delete(`/comment/${tempComment}`)
        .set({
          Authorization: `Bearer ${authenticationTokenTwo}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Delete comment Success");
    });
  });

});
