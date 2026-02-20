/* eslint-disable unicorn/filename-case */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable promise/prefer-await-to-then */
/* eslint-disable unicorn/no-await-expression-member */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable max-nested-callbacks */
/* eslint-disable arrow-body-style */
import fs from 'node:fs';
import path, {dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {agent} from 'supertest';
import {
  test, expect, describe, beforeAll,
} from 'bun:test';
import {fileTypeFromBuffer} from 'file-type';
import app from '../src/app.js';
import {register} from '../src/services/authService.js';
import * as database from '../src/utils/db.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const testDir = path.resolve(import.meta.path, '../');
const API_URL = '/api';

const clearTempDir = () => {
  const directory = path.join(testDir, 'i');
  const files = fs.readdirSync(directory);
  for (const file of files) {
    if (!file.startsWith('.')) {
      fs.unlinkSync(path.join(directory, file));
    }
  }
};

const getFileFromTempDir = (fullPath = false) => {
  const directory = path.join(testDir, 'i');
  const file_ = fs.readdirSync(directory).find(file => !file.startsWith('.')) ?? '';
  return fullPath ? path.join(directory, file_) : file_;
};

beforeAll(done => {
  clearTempDir();
  database.database.prepare('DELETE FROM sessions').run();
  database.database.prepare('DELETE FROM meta').run();
  database.database.prepare('DELETE FROM images').run();
  done();
}, 30_000);
describe('Logged in', () => {
  const api = agent(app);
  beforeAll(async () => {
    await register('testing', 'testing');
    await api
      .post(`${API_URL}/login`)
      .send({username: 'testing', password: 'testing'});
  });
  describe('Images', () => {
    describe.serial('Upload', () => {
      test.serial('200 valid image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/good.jpg`)
          .expect(200);
      });
      test.serial('400 invalid image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/bad.jpg`)
          .expect(400);
      });
      test.serial('400 non image', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/test.txt`)
          .expect(400);
      });
      test.serial('400 image with .txt extension', async () => {
        return api
          .post(`${API_URL}/images`)
          .attach('file', `${__dirname}/good.txt`)
          .expect(400);
      });
    });
    describe.serial('Get', () => {
      test('Image list', async () => {
        return api
          .get(`${API_URL}/images`)
          .expect(200)
          .then(response => {
            console.log(response.body);
            expect(response.body.length).toBe(1);
          });
      });
      test('200 specific image', async () => {
        return api
          .get(`/${getFileFromTempDir()}`)
          .expect(200)
          .then(async response => {
            expect((await fileTypeFromBuffer(response.body))?.mime).toBe('image/jpeg');
          });
      });
      test('200 specific image thumbnail', async () => {
        return api
          .get(`${API_URL}/thumbnails/${getFileFromTempDir()}/webp`)
          .expect(200)
          .then(async response => {
            expect((await fileTypeFromBuffer(response.body))?.mime).toBe('image/webp');
          });
      });
    });
  });
});

describe('Not logged in', () => {
  const api = agent(app);
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
      test('401 Image list', async () => {
        return api.get(`${API_URL}/images`).expect(401);
      });
      test('200 Specific image', async () => {
        return api
          .get(`/${getFileFromTempDir()}`)
          .expect(200)
          .then(async response => {
            expect((await fileTypeFromBuffer(response.body))?.mime).toBe('image/jpeg');
          });
      });
      test('401 Specific image thumbnail', async () => {
        return api
          .get(`${API_URL}/thumbnails/${getFileFromTempDir()}/webp`)
          .expect(401);
      });
    });
  });
});
