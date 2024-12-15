const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router');
const launchesRouter = require('./routes/lounches/launches.router');


const app = express();

app.use(cors({
	origin: 'http://localhost:3000'
}));

app.use(morgan('combined'))

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.use((req, res, next) => {
	console.log(req.method, req.url)
	next();
})


app.use(planetsRouter);
app.use('/launches',launchesRouter);

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'))
})







module.exports = app;