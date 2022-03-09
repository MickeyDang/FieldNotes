/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const testMongoose = require('mongoose');
const server = require('../index');

afterAll(async () => {
  await testMongoose.disconnect();
});

describe('Example Test', () => {
  it('example true equals true', () => {
    expect(true).toBe(true);
  });
  it('example endpoint', async () => {
    const res = await request(server).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Express and TypeScript Server');
  });
});
