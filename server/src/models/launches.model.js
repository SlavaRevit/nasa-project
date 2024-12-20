const launches = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUMBER = 100;

async function saveLaunch(launch) {
	const planet = await planets.findOne({
		kepler_name: launch.target,
	})
	if (!planet) {
		throw new Error(`No matching planet found.`);
	}

	//findOneAndUpdate - will only sett properties set in launch object.
	await launches.findOneAndUpdate({
		flightNumber: launch.flightNumber,
	}, launch, {
		upsert: true,
	});
}

async function existLaunchWithId(launchId) {
	const exists = await launches.findOne({
		flightNumber: launchId,
	})

	return exists;
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
	const launchesFromDB = await launches.find({}, {
		'__v': 0,
		'_id': 0,
	});

	console.log(launchesFromDB);
	return launchesFromDB;
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

async function abortLaunch(launchId) {
	const aborted =  await launches.updateOne({
			flightNumber: launchId
		},
		{
			upcoming: false,
			success: false,
		})

	return aborted.modifiedCount === 1;
}


module.exports = {
	existLaunchWithId,
	getLaunchMission,
	scheduleNewLaunch,
	abortLaunch,
	getAllLaunches,
	launches,
}