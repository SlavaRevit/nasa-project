const API_URL = 'http://localhost:8000';

async function httpGetPlanets() {
  const resp = await fetch(`${API_URL}/planets`);
  // console.log(`response of planets is`, resp);
  return await resp.json();
}

async function httpGetLaunches() {
  const resp = await fetch(`${API_URL}/launches`)
  const fetchedLaunches = await resp.json();
  return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};