const axios = require('axios')

const launches = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

async function saveLaunch(launch) {
	//findOneAndUpdate - will only sett properties set in launch object.
	await launches.findOneAndUpdate(
		{
			flightNumber: launch.flightNumber,
		},
		launch,
		{
			upsert: true,
		}
	)
}

const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches/query'

async function populateLaunches() {
	const response = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			populate: [
				{
					path: 'rocket',
					select: {
						name: 1,
					},
				},
				{
					path: 'payloads',
					select: {
						customers: 1,
					},
				},
			],
		},
	})

	if (response.status !== 200) {
		console.log('Problem downloading launch data')
		throw new Error('Launch data download failed!')
	}

	const launchDocs = response.data.docs
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc['payloads']

		const customers = payloads.flatMap(payload => {
			return payload['customers']
		})

		const launch = {
			flightNumber: launchDoc['flight_number'],
			mission: launchDoc['name'],
			rocket: launchDoc['rocket']['name'],
			launchDate: launchDoc['date_local'],
			upcoming: launchDoc['upcoming'],
			success: launchDoc['success'],
			customers: customers,
		}

		// console.log(`Flight number ${launch.flightNumber}, rocket: ${launch.mission}`);

		await saveLaunch(launch)
	}
}

async function loadLaunchData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat',
	})

	if (firstLaunch) {
		console.log('Launch data already loaded!')
	} else {
		await populateLaunches()
	}
}

async function findLaunch(filter) {
	return await launches.findOne(filter)
}

async function existLaunchWithId(launchId) {
	return await findLaunch(launchId)
}

async function getLatestFlightNumber() {
	const latestLaunch = await launches.findOne().sort('-flightNumber')

	if (!latestLaunch) {
		return DEFAULT_FLIGHT_NUMBER
	}

	return latestLaunch.flightNumber
}

async function getLaunchMission(missionName) {
	return launches.findOne(
		{
			mission: missionName,
		},
		{
			__v: 0,
			_id: 0,
		}
	)
}

async function getAllLaunches(skip, limit) {
	return await launches
		.find(
			{},
			{
				__v: 0,
				_id: 0,
			}
		)
		.sort({ flightNumber: 1 })
		.skip(skip)
		.limit(limit)
}

async function scheduleNewLaunch(launch) {
	const planet = await planets.findOne({
		kepler_name: launch.target,
	})
	if (!planet) {
		throw new Error(`No matching planet found.`)
	}
	const newFlightNumber = (await getLatestFlightNumber()) + 1
	const newLaunch = Object.assign(launch, {
		flightNumber: newFlightNumber,
		success: true,
		upcoming: true,
		customers: ['ZMA', 'NASA'],
	})

	await saveLaunch(newLaunch)
}

async function abortLaunch(launchId) {
	const aborted = await launches.updateOne(
		{
			flightNumber: launchId,
		},
		{
			upcoming: false,
			success: false,
		}
	)

	return aborted.modifiedCount === 1
}

module.exports = {
	loadLaunchData,
	existLaunchWithId,
	getLaunchMission,
	scheduleNewLaunch,
	abortLaunch,
	getAllLaunches,
	launches,
}
