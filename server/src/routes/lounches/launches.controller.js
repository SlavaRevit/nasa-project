const { getAllLaunches, addNewLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
	const { mission, rocket, launchDate, destination } = req.body;
	if (!mission || !rocket || !launchDate || !destination) {
		return res.status(400).json({
			error: 'bad request'
		})
	}

	const launch = {
		mission,
		rocket,
		launchDate: new Date(launchDate),
		destination,
	}

	addNewLaunch(launch);

	res.status(201).json(launch);

}

module.exports = {
	httpGetAllLaunches,
	httpAddNewLaunch,
}