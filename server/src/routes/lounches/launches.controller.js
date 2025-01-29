const { existLaunchWithId, getAllLaunches, scheduleNewLaunch, abortLaunch, getLaunchMission } = require('../../models/launches.model');
const { getPagination } = require('../../services/query');

async function httpGetAllLaunches(req, res) {
	const { skip, limit } = getPagination(req.query);
	const launches = await getAllLaunches(skip,limit);

	return res.status(200).json(launches);
}

async function httpAbortLaunch(req, res) {
	const launchId = +req.params.id;
	const existsLaunch = await existLaunchWithId(launchId);

	if (!existsLaunch) {
		return res.status(400).json({
			error: 'Launch not found',
		})
	}

	const aborted = await abortLaunch(launchId);
	if (!aborted) {
		return res.status(400).json({
			error: 'Launch not aborted'
		})
	}

	return res.status(200).json({
		ok: true,
	})
}

async function httpAddNewLaunch(req, res) {
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

	const launchIsExists = await getLaunchMission(mission);

	if (launchIsExists) {
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

	await scheduleNewLaunch(launch);

	res.status(201).json(launch);
}

module.exports = {
	httpAbortLaunch,
	httpGetAllLaunches,
	httpAddNewLaunch,
}