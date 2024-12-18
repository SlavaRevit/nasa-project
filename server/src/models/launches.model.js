const launches = new Map();

let latestFlightNumber = 100;

const launch = {
	flightNumber: 100,
	mission: 'Kepler Exploration X',
	rocket: 'Explorer IS1',
	launchDate: new Date('December 27, 2030'),
	target: 'Kepler-442 b',
	customer: ['ZTM', 'NASA'],
	upcoming: true,
	success: true,
}

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
	return Array.from(launches.values());
}

function addNewLaunch(launch) {
	latestFlightNumber++;
	launches.set(latestFlightNumber, Object.assign(launch, {
		...launch,
		customers: ['ZTM', 'NASA'],
		flightNumber: latestFlightNumber,
		upcoming: true,
		success: true,
	}));
}

function abortLaunch(launchId) {
	const aborted = launches.get(launchId);
	aborted.upcoming = false;
	aborted.success = false;

	return aborted;
}

function updateLaunch(launchId, fields) {
	const launchToUpdate = launches.get(launchId);
	const newLaunch = Object.assign({},{
		...launchToUpdate,
		...fields,
	})

	launches.set(launchId, newLaunch);

	return newLaunch;
}

module.exports = {
	updateLaunch,
	abortLaunch,
	addNewLaunch,
	getAllLaunches,
	launches,
}