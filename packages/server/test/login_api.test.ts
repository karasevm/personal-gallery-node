/* eslint-disable unicorn/filename-case */
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable arrow-body-style */
import supertest from 'supertest';
import app from '../src/app.js';
import * as database from '../src/utils/db.js';

const api = supertest(app);
const API_URL = '/api';
beforeAll(() => {
  database.database.run('DELETE FROM sessions');
  database.database.run('DELETE FROM meta');
  database.database.run('DELETE FROM images');
});
describe('Login API', () => {
  test('meta status correct', async () => {
    return api
      .get(`${API_URL}/meta`)
      .expect(200)
      .then(response => {
        expect(response.body.setupFinished).toBe(false);
      });
  });
  describe('Registration', () => {
    test('400 on registering with empty username', async () => {
      return api
        .post(`${API_URL}/login/register`)
        .send({username: '', password: 'test'})
        .expect(400);
    });
    test('200 on registering with good credentials', async () => {
      return api
        .post(`${API_URL}/login/register`)
        .send({username: 'test', password: 'test'})
        .expect(200)
        .then(() => {
          expect(database.getMeta('username')).toBe('test');
        });
    });
    test('403 on trying to register second time with good credentials', async () => {
      return api
        .post(`${API_URL}/login/register`)
        .send({username: 'test', password: 'test'})
        .expect(403)
        .then(() => {
          expect(database.getMeta('username')).toBe('test');
        });
    });
  });

  describe('Authorization', () => {
    test('401 on login with incorrect username', async () => {
      return api
        .post(`${API_URL}/login`)
        .send({username: 'wrong', password: 'test'})
        .expect(401);
    });
    test('401 on login with incorrect password', async () => {
      return api
        .post(`${API_URL}/login`)
        .send({username: 'test', password: 'wrong'})
        .expect(401);
    });
    test('401 on login with incorrect credentials', async () => {
      return api
        .post(`${API_URL}/login`)
        .send({username: 'wrong', password: 'wrong'})
        .expect(401);
    });
    test('200 on login with correct credentials', async () => {
      return api
        .post(`${API_URL}/login`)
        .send({username: 'test', password: 'test'})
        .expect(200);
    });
  });
});
