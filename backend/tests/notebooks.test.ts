/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
const request = require('supertest');
const testMongoose = require('mongoose');
const server = require('../index');

const PROJECT_ONE = '621ec4a83203e0aa9fc946fa';
const PROJECT_TWO = '622d18f9bc2900d4c965c004';

beforeEach(async () => {
  const resOne = await request(server)
    .put(`/projects/${PROJECT_ONE}`)
    .send({ repIds: [], relIds: [] });
  expect(resOne.status).toEqual(200);

  const resTwo = await request(server)
    .put(`/projects/${PROJECT_TWO}`)
    .send({
      repIds: [
        '61f176664c843262d91d4dfb',
        '61f176664c843262d91d4e01',
      ],
      relIds: [
        '61f187a24c843262d91d4e98',
      ],
    });
  expect(resTwo.status).toEqual(200);
});

afterAll(async () => {
  await testMongoose.disconnect();
});

describe('Notebook Workflows', () => {
  it('GET projects by id returns appropriate objects', async () => {
    // Basic verification of correctness.
    const resOne = await request(server).get(`/projects/${PROJECT_ONE}`);
    const { project: projectOne } = resOne.body;
    // eslint-disable-next-line no-underscore-dangle
    expect(projectOne._id).toBe(PROJECT_ONE);

    const resTwo = await request(server).get(`/projects/${PROJECT_TWO}`);
    const { project: projectTwo } = resTwo.body;
    // eslint-disable-next-line no-underscore-dangle
    expect(projectTwo._id).toBe(PROJECT_TWO);
  });
  it('Project contains appropriate non-null fields', async () => {
    // Basic verification of correctness.
    const resOne = await request(server).get(`/projects/${PROJECT_ONE}`);
    const { project: projectOne } = resOne.body;

    expect(projectOne.reports.length).toBe(0);
    expect(projectOne.relationships.length).toBe(0);
    expect(projectOne.department).toBeTruthy();
    expect(projectOne.createdDate).toBeTruthy();
    expect(projectOne.lastUpdated).toBeTruthy();
    expect(projectOne.researchStatus).toBeTruthy();
  });
  it('Project two contains two reports and and one relationship', async () => {
    // Used in search mode to differentiate between added and non-added search results.
    const resTwo = await request(server).get(`/projects/${PROJECT_TWO}`);
    const { project: projectTwo } = resTwo.body;

    expect(projectTwo.reports.length).toBe(2);
    expect(projectTwo.relationships.length).toBe(1);
  });
  it('Adding report and relationships ids in project one modifies correct project', async () => {
    // Used in search mode when adding entities to project.
    const putRes = await request(server)
      .put(`/projects/${PROJECT_ONE}`)
      .send({
        repIds: ['61f176664c843262d91d4dfb'],
        relIds: ['61f187a24c843262d91d4e98'],
      });
    expect(putRes.status).toEqual(200);

    const getRes = await request(server).get(`/projects/${PROJECT_ONE}`);
    const { project: projectOne } = getRes.body;

    expect(projectOne.reports.length).toBe(1);
    expect(projectOne.relationships.length).toBe(1);
    expect(projectOne.reports).toContainEqual('61f176664c843262d91d4dfb');
    expect(projectOne.relationships).toContainEqual('61f187a24c843262d91d4e98');
  });
  it('Removing report ids in project two modifies correct project', async () => {
    const putRes = await request(server)
      .put(`/projects/${PROJECT_TWO}`)
      .send({
        repIds: [],
        relIds: ['61f187a24c843262d91d4e98'],
      });
    expect(putRes.status).toEqual(200);

    const getRes = await request(server).get(`/projects/${PROJECT_TWO}`);
    const { project: projectTwo } = getRes.body;

    expect(projectTwo.reports.length).toBe(0);
    expect(projectTwo.relationships.length).toBe(1);
    expect(projectTwo.relationships).toContainEqual('61f187a24c843262d91d4e98');
  });
  it('Project details includes the appropriate report and relationships', async () => {
    // Used when the web app toggles into Notebook view.
    const getRes = await request(server).get(`/projectdata/${PROJECT_TWO}`);
    const { reports, relationships } = getRes.body;
    // eslint-disable-next-line no-underscore-dangle
    const reportIds = reports.map((r: any) => r._id);
    // eslint-disable-next-line no-underscore-dangle
    const relationshipIds = relationships.map((r: any) => r._id);

    expect(reportIds.length).toBe(2);
    expect(reportIds).toContainEqual('61f176664c843262d91d4dfb');
    expect(reportIds).toContainEqual('61f176664c843262d91d4e01');
    expect(relationshipIds.length).toBe(1);
    expect(relationshipIds).toContainEqual('61f187a24c843262d91d4e98');
  });
});
