/* eslint-disable arrow-body-style */
import supertest from 'supertest';
import app from '../src/app';
import * as database from '../src/utils/db';

const api = supertest(app);
const API_URL = '/api';
beforeAll(() => {
  database.db.exec('DELETE FROM sessions');
  database.db.exec('DELETE FROM meta');
  database.db.exec('DELETE FROM images');
});
describe('Login API', () => {
  test('meta status correct', (done) => {
    api
      .get(`${API_URL}/meta`)
      .expect(200)
      .end((err, res) => {
        if (typeof err !== 'undefined') {
          done(err);
        }
        try {
          expect(res.body.setupFinished).toBe(false);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
  describe('Registration', () => {
    test('400 on registering with empty username', () => {
      return api
        .post(`${API_URL}/login/register`)
        .send({ username: '', password: 'test' })
        .expect(400);
    });
    test('200 on registering with good credentials', (done) => {
      api
        .post(`${API_URL}/login/register`)
        .send({ username: 'test', password: 'test' })
        .expect(200)
        .end((err) => {
          if (typeof err !== 'undefined') {
            done(err);
          }
          try {
            expect(database.getMeta('username')).toBe('test');
            done();
          } catch (e) {
            done(e);
          }
        });
    });
    test('403 on trying to register second time with good credentials', (done) => {
      api
        .post(`${API_URL}/login/register`)
        .send({ username: 'test', password: 'test' })
        .expect(403)
        .end((err) => {
          if (typeof err !== 'undefined') {
            done(err);
          }
          try {
            expect(database.getMeta('username')).toBe('test');
            done();
          } catch (e) {
            done(e);
          }
        });
    });
  });

  describe('Authorization', () => {
    test('401 on login with incorrect username', () => {
      return api
        .post(`${API_URL}/login`)
        .send({ username: 'wrong', password: 'test' })
        .expect(401);
    });
    test('401 on login with incorrect password', () => {
      return api
        .post(`${API_URL}/login`)
        .send({ username: 'test', password: 'wrong' })
        .expect(401);
    });
    test('401 on login with incorrect credentials', () => {
      return api
        .post(`${API_URL}/login`)
        .send({ username: 'wrong', password: 'wrong' })
        .expect(401);
    });
    test('200 on login with correct credentials', () => {
      return api
        .post(`${API_URL}/login`)
        .send({ username: 'test', password: 'test' })
        .expect(200);
    });
  });
});
