const express = require('express');
const {
	httpGetAllLaunches,
	httpAddNewLaunch,
	httpAbortLaunch,
	httpUpdateLaunch
} = require('./launches.controller');

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);
launchesRouter.put('/:id', httpUpdateLaunch);

module.exports = launchesRouter;