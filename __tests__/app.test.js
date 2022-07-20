const db = require('../db/connection');
const app = require('../app');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const testData = require('../db/data/test-data/index');
const { checkExists } = require('../utils/utilFunctions');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('GET /api/', () => {
	test('200: Path returns a server ok message', () => {
		return request(app)
			.get('/api/')
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual({ msg: 'Server running ok' });
			});
	});
});
describe('GET /api/users', () => {
	test('200: Returns an array of users', () => {
		let output = {
			users: [
				{
					user_id: 1,
					username: 'mallionaire',
					name: 'haz',
					avatar_url:
						'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
					password: 'user-one',
				},
				{
					user_id: 2,
					username: 'philippaclaire9',
					name: 'philippa',
					avatar_url:
						'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4',
					password: 'user-two',
				},
				{
					user_id: 3,
					username: 'bainesface',
					name: 'sarah',
					avatar_url:
						'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4',
					password: 'user-three',
				},
				{
					user_id: 4,
					username: 'dav3rid',
					name: 'dave',
					avatar_url:
						'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
					password: 'user-four',
				},
			],
		};
		return request(app)
			.get('/api/users')
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(output);
			});
	});
});
describe('GET /api/users/:user', () => {
	test('200: Returns a single user object', () => {
		const userOne = {
			user_id: 1,
			username: 'mallionaire',
			name: 'haz',
			avatar_url:
				'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
			password: 'user-one',
		};
		return request(app)
			.get('/api/users/1')
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual({ user: userOne });
			});
	});
	test('404: Returns a 404 for a valid search with no results', () => {
		return request(app)
			.get('/api/users/12')
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: 'User not found in database' });
			});
	});
	test('400: Returns a 400 for an invalid search', () => {
		return request(app)
			.get('/api/users/banana')
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: 'Invalid Input' });
			});
	});
});
describe('POST /api/users', () => {
	test('201:Responds with a newly created user', () => {
		const newUser = {
			username: 'Magical_Trevor',
			name: 'Verity',
			avatar_url: 'https://avatars.githubusercontent.com/u/66881163?v=4',
			password: 'Trev',
		};

		return request(app)
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.then(({ body }) => {
				const { user } = body;
				expect(user).toEqual(
					expect.objectContaining({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
						password: expect.any(String),
					})
				);
			});
	});
	test('400:Returns an invalid request for missing data', () => {
		const newUser = {
			name: 'verity',
			avatar_url: 'https://avatars.githubusercontent.com/u/66881163?v=4',
		};
		return request(app)
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: 'Invalid Input' });
			});
	});
});
describe('PATCH /api/users/:user', () => {
	test('200:User password is updated', () => {
		const data = { password: 'pAssW0rd' };
		return request(app)
			.patch('/api/users/1')
			.send(data)
			.expect(200)
			.then(({ body }) => {
				const { user } = body;

				expect(user.password).toBe('pAssW0rd');
			});
	});
	test('400:Returns invalid input for missing data', () => {
		const updatedUser = {};
		return request(app)
			.patch('/api/users/1')
			.send(updatedUser)
			.expect(400)
			.then(({ body }) => {
				expect(body).toEqual({ msg: 'Invalid Input' });
			});
	});
	test('404:Returns 404 for a user id that does not exist yet', () => {
		const newUser = {
			username: 'Magical_Trevor',
		};
		return request(app)
			.patch('/api/users/999')
			.send(newUser)
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: 'User not found' });
			});
	});
});
describe('GET /api/user/:user_id/pots', () => {
	test('200: Returns the list of a users pots', () => {
		return request(app)
			.get('/api/users/1/pots')
			.expect(200)
			.then(({ body }) => {
				const { pots } = body;
				expect(pots).toHaveLength(2);
				pots.forEach((pot) => {
					expect(pot).toEqual(
						expect.objectContaining({
							pot_id: expect.any(Number),
							pot_name: expect.any(String),
							owner_id: expect.any(Number),
							notes: expect.any(String),
							goal: expect.any(Number),
							starting_value: expect.any(Number),
							current_value: expect.any(Number),
						})
					);
				});
			});
	});
	test.skip('404: Returns a 404 for a valid request, but no user exists', () => {
		return request(app)
			.get('/api/users/999/pots')
			.expect(404)
			.then(({ body }) => {
				expect(body).toEqual({ msg: 'User not found in database' });
			});
	});
	test('200: Returns a 200 for a valid user with no pots', () => {
		return request(app)
			.get('/api/users/3/pots')
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual({ pots: [] });
			});
	});
});
describe('POST /api/users/:user_id/pots', () => {
	test('201: Responds with newly created pot', () => {
		const newPot = {
			pot_name: 'Cash',
			owner_id: '1',
			notes: 'Takeout pot',
			goal: 500,
			starting_value: 500,
			current_value: 500,
		};
		return request(app)
			.post('/api/users/1/pots')
			.send(newPot)
			.expect(201)
			.then(({ body }) => {
				const { pot } = body;
				expect(pot).toEqual(
					expect.objectContaining({
						pot_id: expect.any(Number),
						pot_name: expect.any(String),
						owner_id: expect.any(Number),
						notes: expect.any(String),
						goal: expect.any(Number),
						starting_value: expect.any(Number),
						current_value: expect.any(Number),
					})
				);
			});
	});
});
describe('PATCH /api/users/:user_id/:pot_id', () => {
	test('200:Pot notes updated', () => {
		const data = { notes: 'More information about this pot.' };

		return request(app)
			.patch('/api/users/1/pots/1')
			.send(data)
			.expect(200)
			.then(({ body }) => {
				const { pot } = body;
				expect(pot.notes).toBe('More information about this pot.');
			});
	});
	test('200:Pot current value updated', () => {
		const data = { current_value: 5000 };

		return request(app)
			.patch('/api/users/1/pots/2')
			.send(data)
			.expect(200)
			.then(({ body }) => {
				const { pot } = body;

				expect(pot.current_value).toBe(5000);
			});
	});
	// test('');
});
