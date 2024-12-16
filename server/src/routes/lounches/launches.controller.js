const { getAllLaunches, addNewLaunch, abortLaunch, updateLaunch } = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {
	return res.status(200).json(getAllLaunches());
}

function httpUpdateLaunch(req, res) {
	const launchId = +req.params.id
	const fields = req.body;

	console.log();


	if (Object.values(fields).length === 0) {
		return res.status(400).json({
			error: 'nothing to update'
		})
	}

	const updatedLaunch = updateLaunch(launchId, fields);

	return res.status(201).json(updatedLaunch);

}

function httpAbortLaunch(req, res) {
	const launchId = +req.params.id;

	if (!launchId) {
		return res.status(400).json({
			error: 'Launch not found',
		})
	}

	const aborted = abortLaunch(launchId)

	return res.status(200).json(aborted)
}

function httpAddNewLaunch(req, res) {
	const { mission, rocket, launchDate, target } = req.body;
	if (!mission || !rocket || !launchDate || !target) {
		return res.status(400).json({
			error: 'bad request'
		})
	}

	const date = new Date(launchDate);
	if (date.toString() === 'Invalid Date') {
		return res.status(400).json({
			error: 'You should enter the valid date.'
		})
	}

	const launches = getAllLaunches().find(launch => launch.mission === mission);
	if (launches) {
		return res.status(400).json({
			error: 'This mission is already scheduled'
		})
	}

	const launch = {
		mission,
		rocket,
		launchDate: date,
		target,
	}

	addNewLaunch(launch);

	res.status(201).json(launch);
}

module.exports = {
	httpUpdateLaunch,
	httpAbortLaunch,
	httpGetAllLaunches,
	httpAddNewLaunch,
}