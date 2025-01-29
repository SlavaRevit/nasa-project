const request = require('supertest');
const app = require('../../app');
const { connect,disconnect } = require('../../services/mongo');

describe('Launches API', () => {
	beforeAll(async () => {
		await connect();
	});
	afterAll(async () => {
		await disconnect();
	})


	describe('Test GET /launches', () => {
		test('It should response with 200 success', async () => {
			const response = await request(app)
				.get('/launches')
				.expect('Content-Type', /json/)
				.expect(200);
		})
	});

	describe('Test GET launches', () => {
		test('It should respond with 200 success', () => {

		})

		test('It should catch missing require properties', () => {})
		test('It should catch invalid dates', () => {})
	});
})

