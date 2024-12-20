const app = require('./app');
const http = require('http');
const mongoose = require('mongoose');
const { loadPlanetsData } = require('./models/planets.model');
const PORT = process.env.PORT || 8000;
const MONGO_URL = "mongodb+srv://viacheslavgf:A2ibEWJzObueayFz@cluster0.q52cz.mongodb.net/Nasa?retryWrites=true&w=majority"


const server = http.createServer(app);

mongoose.connection.once('open',() => {
	console.log('MongoDB connection ready')
})

mongoose.connection.on('error', (err) => {
	console.error(err);
})

async function startServer() {
	await mongoose.connect(MONGO_URL);
	await loadPlanetsData();
	server.listen(PORT, () => {
		console.log(`server is listening on http://localhost:8000`)
	})
}

startServer();


