const app = require('./src/app');
const http = require('http');
const { loadPlanetsData } = require('./src/models/planets.model');
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
	await loadPlanetsData();
	server.listen(PORT, () => {
		console.log(`server is listening on http://localhost:8000`)
	})
}

startServer();


