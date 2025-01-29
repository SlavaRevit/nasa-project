require('dotenv').config();

const app = require('./app');
const http = require('http');

const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model');
const { connect } = require('./services/mongo');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
	await connect();
	await loadPlanetsData();
	await loadLaunchData();
	server.listen(PORT, () => {
		console.log(`server is listening on http://localhost:8000`)
	})
}

startServer();


