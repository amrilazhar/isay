const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  },
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const SENDER_ADDRESS = "noreply@isay.gabatch11.my.id";

const accountType = {
  LOCAL: "local",
  GOOGLE: "google",
};

const User = require("../models/users");

const Profile = require("../models/profile");

const validationErrorHandler = require("../utils/validationErrorHandler");

const successMessage = "Fetched user successfully";

const userFields = ["newEmail", "password"];

const generateToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return token;
};

exports.signup = async (req, res, next) => {
  try {
    validationErrorHandler(req, res, next);

    const user = new User({
      email: req.body.email,
      password: req.body.password,
      emailToken: generateToken(),
      emailExpiration: Date.now() + 3600000,
      accountType: accountType.LOCAL,
    });

    await user.save();
    const emailTemplate = require('../utils/emailConfirmation');
    nodemailerMailgun.sendMail({
      from: SENDER_ADDRESS,
      to: user.email,
      subject: "Welcome to i-Say!",
      html : emailTemplate.bodyEmail(user.emailToken),
      // html: `<a href="${process.env.SERVER_URI}/user/verify?action=verifyEmail&token=${user.emailToken}">Click here to verify your e-mail!</a>`,
    });

    const token = jwt.sign(
      {
        id: user._id.toString(),
        admin: user.admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "User created!",
      data: { id: user._id, token: token },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.signupGoogle = async (req, res, next) => {
  try {
    validationErrorHandler(req, res, next);

    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    const emailExists = await Promise.all([
      User.exists({ email: email }),
      User.exists({
        newEmail: email,
        emailExpiration: { $gt: Date.now() },
      }),
    ]);
  
    if (emailExists[0] || emailExists[1]) {
      const err = new Error("E-mail is already used");
      err.statusCode = 422;
      throw err;
    }

    const user = new User({
      email: email,
      emailVerified: true,
      accountType: accountType.GOOGLE,
    });

    await user.save();

    nodemailerMailgun.sendMail({
      from: SENDER_ADDRESS,
      to: user.email,
      subject: "Welcome to i-Say!",
      html: `Welcome to i-Say! You are finished registering with your Google account!`,
    });

    const token = jwt.sign(
      {
        id: user._id.toString(),
        admin: user.admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      success: true,
      message: "User created!",
      data: { id: user._id, token: token },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    validationErrorHandler(req, res, next);

    const password = req.body.password;

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      const error = new Error("A user with this e-mail could not be found");
      error.statusCode = 401;
      throw error;
    }

    if (user.accountType !== accountType.LOCAL) {
      const error = new Error(
        "Invalid account type, try login using your Google account instead"
      );
      error.statusCode = 400;
      throw error;
    }

    if (!user.emailVerified) {
      const error = new Error("Email Not Verified");
      error.statusCode = 401;
      throw error;
    }

    const isEqual = await user.comparePassword(password);

    if (!isEqual) {
      const error = new Error("Wrong password!");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        admin: user.admin,
        profile: user.profile,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      message: "Login success",
      data: { token: token, id: user._id.toString() },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.loginGoogle = async (req, res, next) => {
  try {
    validationErrorHandler(req, res, next);

    const ticket = await client.verifyIdToken({
      idToken: req.body.token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email } = ticket.getPayload();

    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("A user with this e-mail could not be found");
      error.statusCode = 401;
      throw error;
    }

    if (user.accountType !== accountType.GOOGLE) {
      const error = new Error(
        "Invalid account type, try login by using your email and password"
      );
      error.statusCode = 400;
      throw error;
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        admin: user.admin,
        profile: user.profile,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      success: true,
      message: "Login success",
      data: { token: token, id: user._id.toString() },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getSingleUser = async (req, res, next) => {
  try {
    validationErrorHandler(req, res, next);

    const userId = req.params.userId;

    let pipeline = [
      { $match: { _id: userId } },
      {
        $project: {
          _id: 0,
          id: "$_id",
        },
      },
    ];

    if (req.user?.uid === req.params.userId.toString()) {
      pipeline = [
        { $match: { _id: userId } },
        {
          $project: {
            _id: 0,
            id: "$_id",
            email: "$email",
          },
        },
      ];
    }

    const [user] = await User.aggregate(pipeline);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: successMessage,
      data: user,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    validationErrorHandler(req, res, next);

    if (req.user.accountType !== accountType.LOCAL) {
      const error = new Error(
        "Invalid account type, only account with local authentication type that can change their e-mail and/or password"
      );
      error.statusCode = 400;
      throw error;
    }

    let noFieldUpdated = true;

    userFields.forEach((field) => {
      if (req.body[field]) {
        noFieldUpdated = false;
        req.user[field] = req.body[field];
      }
    });

    if (noFieldUpdated) {
      const err = new Error("No field was updated");
      err.statusCode = 422;
      throw err;
    }

    if (req.body?.newEmail) {
      const checkEmail = await Promise.all([
        User.exists({ email: req.body.email }),
        User.exists({
          newEmail: req.body.email,
          emailExpiration: { $gt: Date.now() },
        }),
      ]);

      if (checkEmail[0] || checkEmail[1]) {
        const err = new Error("E-mail is already used");
        err.statusCode = 422;
        throw err;
      }
   
      req.user.emailToken = generateToken();
      req.user.emailExpiration = Date.now() + 3600000;

      nodemailerMailgun.sendMail({
        from: SENDER_ADDRESS,
        to: req.user.newEmail,
        subject: "i-Say - E-mail Confirmation",
        html: `<a href="${process.env.SERVER_URI}/user/verify?action=verifyEmail&token=${req.user.emailToken}">Click here to verify your e-mail!</a>`,
      });
    }

    await req.user.save();

    const user = {
      id: req.user._id,
      newEmail: req.user.newEmail,
    };

    res.status(200).json({
      success: true,
      message: "User updated",
      data: user,
    });
  } catch (err) {
    
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    validationErrorHandler(req, res, next);

    const user = await User.findOne({ email: req.body.email });

    user.resetPasswordToken = generateToken();
    user.resetPasswordExpiration = Date.now() + 3600000;

    await user.save();

    nodemailerMailgun.sendMail({
      from: SENDER_ADDRESS,
      to: user.email,
      subject: "i-Say - E-mail Confirmation",
      html: `<a href="${process.env.SERVER_URI}/verify?action=resetPassword&token=${user.resetPasswordToken}">Click here to reset your password!</a>`,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link has been sent!",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.verify = async (req, res, next) => {
  let user;
  try {
    switch (req.query.action) {
      case "resetPassword":
        user = await User.findOne({
          resetPasswordToken: req.query.token,
          resetPasswordExpiration: { $gt: Date.now() },
        });

        if (!user) {
          const err = new Error("Invalid token or token has expired");
          err.statusCode = 404;
          throw err;
        }

        return res.status(200).json({
          success: true,
          message: "Token is valid",
          data: {
            token: user.resetPasswordToken,
          },
        });
      case "verifyEmail":
        user = await User.findOne({
          emailToken: req.query.token,
          emailExpiration: { $gt: Date.now() },
        });

        if (!user) {
          const err = new Error("Invalid token or token has expired");
          err.statusCode = 404;
          throw err;
        }

        user.emailToken = null;
        user.emailExpiration = null;
        user.emailVerified = true;

        if (user.newEmail) {
          user.email = user.newEmail;
          user.newEmail = null;
        }

        await user.save();
        res.redirect('https://isaybatch11.herokuapp.com/');
        // return res.status(200).json({
        //   success: true,
        //   message: "E-mail has been verified",
        //   data: {
        //     email: user.email,
        //   },
        // });
      default:
        const err = new Error("Invalid action");
        err.statusCode = 400;
        throw err;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpiration: { $gt: Date.now() },
    });

    if (!user) {
      const err = new Error("Invalid token or token has expired");
      err.statusCode = 404;
      throw err;
    }

    user.password = req.body.password;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been changed",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.statusProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 400;
      throw err;
    }

    if (!user.profile) {
      const err = new Error("Profile Not Yet Created");
      err.statusCode = 400;
      throw err;
    }
    return res.status(200).json({
      success: true,
      message: "Profile Has Been Created",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createFirstProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 400;
      throw err;
    }

    if (user.profile) {
      const err = new Error("Profile Has Been Created");
      err.statusCode = 400;
      throw err;
    }

    if (!req.body.location) {
      const err = new Error("Location ID must be inserted");
      err.statusCode = 400;
      throw err;
    }

    if (!req.body.interest) {
      const err = new Error("Interest ID must be inserted");
      err.statusCode = 400;
      throw err;
    }

    if (!req.body.activity) {
      const err = new Error("Activity ID must be inserted");
      err.statusCode = 400;
      throw err;
    }
    let interest = JSON.parse(req.body.interest);
    let activity = JSON.parse(req.body.activity);

    let profileData = {
      name: req.body.name,
      avatar: req.body.avatar,
      location: req.body.location,
      interest: interest,
      user: req.user._id,
    };

    //create first profile data
    let createProfile = await Profile.create(profileData);

    if (!createProfile) {
      const err = new Error("Cannot create Profile");
      err.statusCode = 400;
      throw err;
    }
    createProfile.populate("interest").execPopulate();
    // update profile id on user table
    let updatedProfile = await User.findOneAndUpdate(
      { _id: req.user._id },
      { profile: createProfile._id },
      { new: true }
    );

    // create new token for auth in application
    const token = jwt.sign(
      {
        id: updatedProfile._id.toString(),
        admin: user.admin,
        profile: updatedProfile.profile,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    return res.status(200).json({
      success: true,
      message: "Profile Created",
      data: {
        token: token,
        id: updatedProfile._id,
        name: createProfile.name,
        avatar: createProfile.avatar,
        interest: createProfile.interest,
        funfact: req.body.funfact,
      },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
