const mongoose = require('mongoose');

mongoose.set('debug', true);

const mongooseConnect = mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

module.exports = mongooseConnect;
