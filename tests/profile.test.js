const request = require("supertest");
const app = require("../index");
const jwt = require("jsonwebtoken");

const { user, comment, profile } = require("../models"); // import transaksi models

let authenticationToken = "0";
let tempID = "";
let tempProfile = "608ac649c8d0a1bfded1946b";
let tempProfileTwo = "60935f673fba7223585128d1";
let tempUserTwo = "60a8ca95014fc025303025d1";
let tempStatus = "6093967f3fba722358512955";
let tempAct = "609f765707b67c021317d7d8";

//==================|| Post comment and make user ||==================
  describe("/POST Comment ", () => {
    test("It should return success", async () => {
      let status_id = "6093967f3fba722358512955";

      //drop and create table users
      await user.collection.dropIndexes();
      await user.deleteMany();
      await user.collection.createIndex({ email: 1 }, { unique: true });

      //delete comment
      //delete profile
      await comment.deleteMany();
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
      userProfile._id = tempProfile;

      //create data user
      const dataUser = {
        email: "isayjhorgi@test.com",
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
        .get(`/getProfile/${tempProfile}`)
        .set({
          Authorization: `Bearer ${authenticationToken}`,
        })

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Object);
      expect(res.body.success).toEqual(true);

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
      interest: [
        "6092b557e957671c70e24276",
        "6092b557e957671c70e24277",
      ],
      avatar: "http://dummyimage.com/167x100.png/ff4444/ffffff",
    };

    let userProfileTwo = await profile.create(dataProfileTwo);
    userProfileTwo._id = tempProfileTwo;

    //create data user
    const dataUserTwo = {
      email: "isayjhorgi@test.com",
      password: "Aneh1234!!",
      admin: false,
      emailVerified: true,
      profile: userProfile._id,
    };

    let userCreateNew = await user.create(dataUserTwo);
    userCreateNew._id = tempUserTwo;

    const dataStatus = {
      content: "yahooo !!",
      owner: tempProfileTwo,
    };
    let statusDummy = await status.create(dataStatus);
    statusDummy._id = tempStatus;

    const dataActivities = {
      type: `${dataProfileTwo.name} make a status`,
      status_id: tempStatus,
	    owner: tempProfileTwo,
    };
    let activitiesDummy = await activites.create(dataActivities);
    activitiesDummy._id = tempAct;

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

//==================|| view my profile's post ||==================
describe("/GET Profile's post", () => {
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

//==================|| view my profile's activities ||==================
describe("/GET Profile's activities", () => {
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

//=============|| edit our profile ||=========================
describe("/PUT edit my profile", () => {
  test("It should return success", async () => {
    const res = await request(app)
      .put(`/profile/${tempProfile}`)
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      }).send({
        bio: "this is my bio",
        name: "Jhorgi",
        interest: [ "6092b557e957671c70e24278",
        "6092b557e957671c70e24279"],
        location: "608f5baf87fc4f408c131780"
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
      .put(`/profile/Intereest/${tempProfile}?id_interest=6092b557e957671c70e24286`)
      .set({
        Authorization: `Bearer ${authenticationToken}`,
      })

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body.success).toEqual(true);
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

