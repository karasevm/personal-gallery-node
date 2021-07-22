/* eslint-disable arrow-body-style */
import supertest from 'supertest';
import fs from 'fs';
import path from 'path';
import fileType from 'file-type';
import app from '../src/app';
import { register } from '../src/services/authService';
import * as database from '../src/utils/db';

const API_URL = '/api';

const clearTempDir = () => {
  const directory = path.join(process.cwd(), 'test', 'i');
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    if (!file.startsWith('.')) {
      fs.unlinkSync(path.join(directory, file));
    }
  });
};

const getFileFromTempDir = (fullPath = false) => {
  const directory = path.join(process.cwd(), 'test', 'i');
  const files = fs.readdirSync(directory);
  return fullPath ? path.join(directory, files[1]) : files[1];
};

beforeAll(async (done) => {
  clearTempDir();
  database.db.prepare('DELETE FROM sessions').run();
  database.db.prepare('DELETE FROM meta').run();
  database.db.prepare('DELETE FROM images').run();
  done();
}, 30000);
describe('Logged in', () => {
  const api = supertest.agent(app);
  beforeAll(async () => {
    await register('testing', 'testing');
    await api
      .post(`${API_URL}/login`)
      .send({ username: 'testing', password: 'testing' });
  });
  describe('Images', () => {
    describe('Upload', () => {
      test('200 valid image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/good.jpg`)
          .expect(200);
      });
      test('400 invalid image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/bad.jpg`)
          .expect(400);
      });
      test('400 non image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/test.txt`)
          .expect(400);
      });
      test('400 image with .txt extension', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/good.txt`)
          .expect(400);
      });
    });
    describe('Get', () => {
      let imageUrl = '';
      let imageName = '';
      test('Image list', (done) => {
        api
          .get(`${API_URL}/images`)
          .expect(200)
          .end((err, res) => {
            if (typeof err !== 'undefined') {
              done(err);
            }
            try {
              expect(res.body.length).toBe(1);
              imageUrl = res.body[0].url;
              imageName = res.body[0].filename;
              done();
            } catch (e) {
              done(e);
            }
          });
      });
      test('200 specific image', (done) => {
        api
          .get(imageUrl)
          .expect(200)
          .end(async (err, res) => {
            if (typeof err !== 'undefined') {
              done(err);
            }
            try {
              expect(await fileType.fromBuffer(res.body)).toBe('image/jpeg');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
      test('200 specific image thumbnail', (done) => {
        api
          .get(`${API_URL}/thumbnails/${imageName}/webp`)
          .expect(200)
          .end(async (err, res) => {
            if (typeof err !== 'undefined') {
              done(err);
            }
            try {
              expect(await fileType.fromBuffer(res.body)).toBe('image/webp');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
    });
  });
});

describe('Not logged in', () => {
  const api = supertest.agent(app);
  describe('Images', () => {
    describe('Upload', () => {
      test('401 valid image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/good.jpg`)
          .expect(401);
      });
      test('401 invalid image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/bad.jpg`)
          .expect(401);
      });
      test('401 non image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/test.txt`)
          .expect(401);
      });
      test('401 image with .txt extension', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/good.txt`)
          .expect(401);
      });
    });
    describe('Get', () => {
      test('401 Image list', () => {
        return api
          .get(`${API_URL}/images`)
          .expect(401);
      });
      test('200 Specific image', (done) => {
        api
          .get(`/${getFileFromTempDir()}`)
          .expect(200)
          .end(async (err, res) => {
            if (typeof err !== 'undefined') {
              done(err);
            }
            try {
              expect(await fileType.fromBuffer(res.body)).toBe('image/jpeg');
              done();
            } catch (e) {
              done(e);
            }
          });
      });
      test('401 Specific image thumbnail', () => {
        return api
          .get(`${API_URL}/thumbnails/${getFileFromTempDir()}/webp`)
          .expect(401);
      });
    });
  });
});
