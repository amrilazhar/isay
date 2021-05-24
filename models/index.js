const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true, //use to make unique data Types
    useFindAndModify: false, //usefindAndUpdate instead of findAndModify
  })
  .then(() => console.log("database connected"))
  .catch((e) => console.log(e));

// IMPORT MODELS
module.exports.user = require("./users.js");
module.exports.activities = require("./activities.js");
module.exports.comment = require("./comment.js");
module.exports.status = require("./status.js");
module.exports.profile = require("./profile.js");
module.exports.interest = require("./interest.js");
module.exports.chat = require("./chat.js");
module.exports.location = require("./location.js");
module.exports.notification = require("./notification.js");
module.exports.funfact = require("./funfact.js");
//END IMPORT MODELS
