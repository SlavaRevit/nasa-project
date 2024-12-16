const { describe, test, expect } = require('@jest/globals');
const request = require('supertest');
const app = require('../../app');

describe('Test GET /launches',  () => {

	test('It should response with 200 success',  async () => {
		const response = await request(app)
			.get('/launches')
			.expect(200);
	})
});

describe('Test POST launches', () => {
	const launchDate = {
		'mission': 'test',
		'rocket': 'test',
		'target': 'test',
		'launchDate': 'January 4, 2024'
	}

	const launchDateWithInvalidDate = {
		'mission': 'test',
		'rocket': 'test',
		'target': 'test',
		'launchDate': 'dassa123',
	}

	const launchDateWithoutDate =  {
		'mission': 'test',
		'rocket': 'test',
		'target': 'test',
	}

	test('It should respond with 201 created', async () => {
		const resp = await request(app)
			.post('/launches')
			.send(launchDate)
			.expect('Content-type', /json/)
			.expect(201);

		const requestDate = new Date(launchDate.launchDate).valueOf();
		const responseDate = new Date(resp.body.launchDate).valueOf();

		expect(requestDate).toBe(responseDate);
		expect(resp.body).toMatchObject(launchDateWithoutDate)
	})

	test('It should catch missing require properties', async () => {
		const resp = await request(app)
			.post('/launches')
			.send(launchDateWithoutDate)
			.expect('Content-type', /json/)
			.expect(400);

		expect(resp.body).toStrictEqual({
			error: 'bad request'
		})
	})
	test('It should catch invalid dates', async () => {
		const resp = await request(app)
			.post('/launches')
			.send(launchDateWithInvalidDate)
			.expect('Content-type', /json/)
			.expect(400);

		expect(resp.body).toStrictEqual({
			error: 'You should enter the valid date.'
		})
	})
});