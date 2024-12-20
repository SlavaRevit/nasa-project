const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
const mongoose = require("mongoose");

const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
	flightNumber: 100,
	mission: 'Kepler Exploration 999999',
	rocket: 'Explorer IS1',
	launchDate: new Date('December 27, 2030'),
	target: 'Kepler-442 b',
	customers: ['ZTM', 'NASA'],
	upcoming: true,
	success: true,
}

// launches.set(launch.flightNumber, launch);
async function saveLaunch(launch) {
	const planet = await planets.findOne({
		kepler_name: launch.target,
	})
	if (!planet) {
		throw new Error(`No matching planet found.`);
	}

	await launches.updateOne({
		flightNumber: launch.flightNumber,
	}, launch, {
		upsert: true,
	});
}

async function getLatestFlightNumber() {
	const latestLaunch = await launches
		.findOne()
		.sort('-flightNumber')

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLaunch.flightNumber;
}

async function getLaunchMission(missionName) {
	return launches.findOne({
		mission: missionName,
	}, {
		'__v':0,
		'_id':0,
	})
}

async function getAllLaunches() {
	return await launches.find({}, {
		'__v': 0,
		'_id': 0,
	});
}

async function scheduleNewLaunch(launch) {
	const newFlightNumber = await getLatestFlightNumber() + 1;
	const newLaunch = Object.assign(launch, {
		flightNumber: newFlightNumber,
		success: true,
		upcoming: true,
		customers: ['ZMA', 'NASA']
	})

	await saveLaunch(newLaunch);
}

function abortLaunch(launchId) {
	const aborted = launches.get(launchId);
	aborted.upcoming = false;
	aborted.success = false;

	return aborted;
	// return launches.filter(launch => launch.flightNumber === launchId);
}


module.exports = {
	getLaunchMission,
	scheduleNewLaunch,
	abortLaunch,
	getAllLaunches,
	launches,
}