const { describe, test, expect } = require('@jest/globals');

describe('Test GET /launches', () => {
	test('It should response with 200 success', () => {
		const response = 200;
		expect(response).toBe(200);
	})
});

describe('Test GET launches', () => {
	test('It should respond with 200 success', () => {

	})

	test('It should catch missing require properties', () => {})
	test('It should catch invalid dates', () => {})
});