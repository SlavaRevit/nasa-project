const mongoose = require('mongoose');

const launchesScheme = new mongoose.Schema({
	flightNumber: {
		type: Number,
		required: true,
	},
	launchDate: {
		type: Date,
		required: true,
	},
	mission: {
		type:String,
		required: true,
	},
	rocket: {
		type:String,
		required: true,
	},
	target: {
		type: String,
	},
	customers: [ String ],
	upcoming: {
		type: Boolean, required: true
	},
	success: {
		type:Boolean, required: true, default: true
	},
});

// Connects launches scheme with "launches" collections
module.exports = mongoose.model('Launch', launchesScheme);