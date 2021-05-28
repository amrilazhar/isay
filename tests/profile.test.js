const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const { user, profile} = require("../models");

let authenticationToken = "0";
let tempProfile = "60b0af790d1bf101446e25eb";
let tempLogin = "60b09064c6cd100e28513002";
let tempProfileTwo = "60935f673fba7223585128d1";


describe("Profile TEST", () => {
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

  //==================|| Post comment and make user ||==================
  describe("/GET profile ", () => {
    test("It should return success", async () => {

      //drop and create table users
      await user.collection.dropIndexes();
      await user.deleteMany();
      await user.collection.createIndex({ email: 5 }, { unique: true });

      //delete comment
      //delete profile
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
      tempProfile = userProfile._id;
      //create data user
      const dataUser = {
        email: "isayjhorgi@test.com",
        password: "Aneh1234!!",
        admin: false,
        emailVerified: true,
        profile: tempProfile,
      };

      let userLogin = await user.create(dataUser);
      tempLogin = userLogin._id;

      //generate token
      const token = jwt.sign(
        {
          id: tempLogin,
          admin: userLogin.admin,
          profile: tempProfile,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );

      //save token variable for later use
      authenticationToken = token;

      const res = await request(app)
        .get(`/profile/getProfile/${tempProfile}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
      expect(res.body.message).toEqual("Success");
    });
  });

  //==================|| view my profile's status ||==================
  describe("/GET Profile's post", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .get("/profile/Post")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
    });
  });

  //==================|| view my profile's activities ||==================
  describe("/GET Profile's activities", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .get("/profile/Activities")
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
    });
  });

  //==================|| view another profile's activities ||==================
  describe("/GET make dummy user and view its profile", () => {
    test("It should return success", async () => {
      //create data profile
      const dataProfileTwo = {
        bio: "new bio",
        name: "Anonymous",
        location: "608f5baf87fc4f408c131780",
        interest: ["6092b557e957671c70e24276", "6092b557e957671c70e24277"],
        avatar: "http://dummyimage.com/167x100.png/ff4444/ffffff",
      };

      let userProfileTwo = await profile.create(dataProfileTwo);
      tempProfileTwo = userProfileTwo._id;

      //create data user
      const dataUserTwo = {
        email: "isayluffy@test.com",
        password: "Aneh1234!!",
        admin: false,
        emailVerified: true,
        profile: tempProfileTwo,
      };

      let userCreateNew = await user.create(dataUserTwo);
      tempUserTwo = userCreateNew._id;

      const res = await request(app)
        .get(`/profile/an/${tempProfileTwo}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
    });
  });

  //==================|| view another profile's post ||==================
  describe("/GET another member profile's post", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .get(`/profile/an/Post/${tempProfileTwo}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
    });
  });

  //==================|| view another profile's activities ||==================
  describe("/GET another member profile's activities", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .get(`/profile/an/Activities/${tempProfileTwo}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
    });
  });

  //=============|| edit our profile (error 1)||=========================
  describe("/PUT edit my profile", () => {
    describe("It should return failed", () => {
      it("[Error] id profile is not valid and must be 24 character & hexadecimal", async () => {
        const res = await request(app)
          .put(`/profile/60b0af790d1bf101446e25`)
          .set({
            Authorization: `Bearer ${authenticationToken}`,
          })
          .send({
            bio: "this is my bio",
            name: "Jhorgi",
            interest: ["6092b557e957671c70e24278", "6092b557e957671c70e24279"],
            location: "608f5baf87fc4f408c131780",
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual(
          "id profile is not valid and must be 24 character & hexadecimal"
        );
      });
    });
  });

  //=============|| edit our profile (error 2)||=========================
  describe("/PUT edit my profile", () => {
    describe("It should return failed", () => {
      it("[Error] Name must be alphabet", async () => {
        const res = await request(app)
          .put(`/profile/${tempProfile}`)
          .set({
            Authorization: `Bearer ${authenticationToken}`,
          })
          .send({
            bio: "this is my bio",
            name: "Jhorgi56",
            interest: ["6092b557e957671c70e24278", "6092b557e957671c70e24279"],
            location: "608f5baf87fc4f408c131780",
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual("Name must be alphabet");
      });
    });
  });

  //=============|| edit our profile (error 3)||=========================
  describe("/PUT edit my profile", () => {
    describe("It should return failed", () => {
      it("[Error] id user is not valid and must be 24 character & hexadecimal", async () => {
        const res = await request(app)
          .put(`/profile/${tempProfile}`)
          .set({
            Authorization: `Bearer ${authenticationToken}`,
          })
          .send({
            bio: "this is my bio",
            name: "Jhorgi",
            interest: ["6092b557e957671c70e24278", "6092b557e957671c70e24279"],
            location: "608f5baf87fc4f408c131780",
            user: "60935f673fba7223585128",
          });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.message).toEqual(
          "id user is not valid and must be 24 character & hexadecimal"
        );
      });
    });
  });

  //=============|| edit our profile ||=========================
  describe("/PUT edit my profile", () => {
    test("It should return success", async () => {
      const res = await request(app)
        .put(`/profile/${tempProfile}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })
        .send({
          bio: "this is my bio",
          name: "Jhorgi",
          interest: ["6092b557e957671c70e24278", "6092b557e957671c70e24279"],
          location: "608f5baf87fc4f408c131780",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);
    });
  });

//===============|| edit our interest (+add) ||===============
describe("/PUT Edit Interest (add)", () => {
  test("It should return success", async () => {
    const res = await request(app)
      .put(`/profile/Interest/${tempProfile}?id_interest=6092b557e957671c70e24286`)
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.success).toEqual(true);
    expect(res.body.message).toEqual(
      "Add Interest Success"
    );
  });
});

//===============|| edit our interest (-delete) ||===============
describe("/PUT Edit Interest (delete)", () => {
  test("It should return success", async () => {
    const res = await request(app)
      .put(`/profile/DeleteInt/${tempProfile}?id_interest=6092b557e957671c70e24286`)
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.success).toEqual(true);
  });
});

//================||get user Interest ||====================
describe("/GET User Interest", () => {
  test("It should return success", async () => {
    const res = await request(app)
      .get(`/profile/userInterest`)
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.success).toEqual(true);
  });
});


});
