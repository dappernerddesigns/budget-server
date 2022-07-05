const db = require('../db/connection');
const app = require('../app');
const seed = require('../db/seeds/seed.js');
const request = require('supertest');
const testData = require('../db/data/test-data/index');

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
describe.skip('PATCH /api/users/:user', () => {
	test('200:User password is updated', () => {
		const columnToUpdate = 'password';
		const updatedPassword = 'pAssW0rd';
		const data = { password: updatedPassword };
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
		const updatedUser = {
			username: 'mallionaire',
			avatar_url:
				'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
			password: 'pAssW0rd',
		};
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
			name: 'Verity',
			avatar_url: 'https://avatars.githubusercontent.com/u/66881163?v=4',
			password: 'Trev',
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
