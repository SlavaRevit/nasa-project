const mongoose = require('mongoose');

const planetsScheme = new mongoose.Schema({
	kepler_name: {
		type: String,
		required: true,
	},
})

module.exports = mongoose.model('Planet', planetsScheme);
