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

describe('Testing Date Range Endpoint', () => {
  it('Return min and max dates', async () => {
    const res = await request(server)
      .get('/daterange');
    const oldest = new Date(res.body.oldestDate[0].creationDate);
    const newest = new Date(res.body.newestDate[0].creationDate);
    expect(oldest).toEqual(new Date('2016-05-01'));
    expect(newest).toEqual(new Date('2021-09-01'));
  });
});

describe('Testing Search Results', () => {
  it('Empty search, should return nothing', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '',
        time: '',
        sortOrderParams: '',
      });
    expect(res.body.reports.length).toEqual(0);
    expect(res.body.relationships.length).toEqual(0);
  });

  it('Empty search with undefined time, should return nothing', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '',
        time: 'undefined',
        sortOrderParams: '',
      });
    expect(res.status).toEqual(200);
    expect(res.body.reports.length).toEqual(0);
    expect(res.body.relationships.length).toEqual(0);
  });

  it('View of all Vancouver - expecting all documents in database to show', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '-123.79564759666101,49.074679801346434,-122.45835240334033,49.48446893846153',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: '',
      });
    expect(res.body.reports.length).toEqual(23);
    expect(res.body.relationships.length).toEqual(55);
  });

  it('Testing garbage keyword', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: 'Garbage Word',
        box: '-123.11846249244809,49.24556198667986,-123.02592778969033,49.28536308241266',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: '',
      });
    const { reports } = res.body;
    const { relationships } = res.body;
    expect(reports.length).toEqual(0);
    expect(relationships.length).toEqual(0);
  });

  it('Testing 1 keyword (Rain and Snow), should return 1 relationship, 3 reports', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: 'Rain and Snow',
        box: '-123.11846249244809,49.24556198667986,-123.02592778969033,49.28536308241266',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: '',
      });
    const { reports } = res.body;
    const { relationships } = res.body;
    expect(res.body.relationships[0].name).toEqual('Rosina Enriquez');
    expect(res.body.relationships.length).toEqual(1);
    expect(res.body.reports.length).toEqual(3);
    expect(res.body.reports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Gastown Complete Streets' }),
        expect.objectContaining({ name: 'Olympic Village Consultation Plan' }),
        expect.objectContaining({ name: 'Renfrew Station Green Energy' }),
      ]),
    );
    reports.forEach((report: any) => {
      // Check report tags
      const { tags } = report;
      expect(tags).toContain('Rain and Snow');
    });
    // Check keywords for relationships
    relationships.forEach((relationship: any) => {
      const { tags } = relationship;
      expect(tags).toContain('Rain and Snow');
    });
  });

  it('Testing 2 keywords (Rain and Snow, Sea Level Rise), should return 1 relationship, 3 reports', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: 'Sea Level Rise,Rain and Snow',
        box: '-123.14157255369007,49.22870576792994,-123.04079711864625,49.288407332970166',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: 'creationDate,firstContacted',
      });
    const { reports } = res.body;
    const { relationships } = res.body;
    expect(res.body.relationships.length).toEqual(1);
    expect(res.body.reports.length).toEqual(3);
    expect(res.body.reports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Granville Island Plan' }),
        expect.objectContaining({ name: 'Olympic Village Consultation Plan' }),
        expect.objectContaining({ name: 'Gastown Complete Streets' }),
      ]),
    );
    expect(res.body.relationships).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Rosina Enriquez' }),
      ]),
    );
    reports.forEach((report: any) => {
      // Check report tags
      const { tags } = report;
      expect(tags).toContain('Sea Level Rise');
      expect(tags).toContain('Rain and Snow');
    });
    // Check keywords for relationships
    relationships.forEach((relationship: any) => {
      const { tags } = relationship;
      expect(tags).toContain('Sea Level Rise');
      expect(tags).toContain('Rain and Snow');
    });
  });

  it('Testing custom date range (Oct 2018 - Dec 2019), should return 2 reports', async () => {
    const dateFrom = new Date('October 1, 2018');
    const dateTo = new Date('December 1, 2019');
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '-123.14157255369007,49.22870576792994,-123.04079711864625,49.288407332970166',
        time: '29,43,2016,5,2021,9,64',
        sortOrderParams: 'creationDate,firstContacted',
      });
    expect(res.body.reports.length).toEqual(2);
    expect(res.body.reports).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Children\'s Hospital Plan' }),
        expect.objectContaining({ name: 'Olympic Village Consultation Plan' }),
      ]),
    );
    const { reports } = res.body;
    reports.forEach((report: any) => {
      const date = new Date(report.creationDate);
      expect(date.getTime()).toBeGreaterThanOrEqual(dateFrom.getTime());
      expect(date.getTime()).toBeLessThanOrEqual(dateTo.getTime());
    });
  });

  it('Sort reports alphabetically', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: 'Nature Restoration',
        box: '-123.14463099069079,49.222170227589714,-123.03800878591665,49.28392570393112',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: 'name,name',
      });
    expect(res.body.reports.length).toEqual(3);
    expect(res.body.reports[0].name).toEqual('Children\'s Hospital Plan');
    expect(res.body.reports[1].name).toEqual('John Hendry Park Development');
    expect(res.body.reports[2].name).toEqual('Olympic Village Consultation Plan');
    const { reports } = res.body;
    reports.forEach((report: any, index: number) => {
      const currentName = report.name;
      if (index < reports.length - 1) {
        const nextName = reports[index + 1].name;
        // current should be less than next
        expect(currentName.localeCompare(nextName)).toEqual(-1);
      }
    });
  });

  it('Sort reports by createdDate', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: 'Nature Restoration',
        box: '-123.14463099069079,49.222170227589714,-123.03800878591665,49.28392570393112',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: 'creationDate,firstContacted',
      });
    expect(res.body.reports.length).toEqual(3);
    expect(res.body.reports[0].name).toEqual('John Hendry Park Development');
    expect(res.body.reports[1].name).toEqual('Children\'s Hospital Plan');
    expect(res.body.reports[2].name).toEqual('Olympic Village Consultation Plan');
    const { reports } = res.body;
    reports.forEach((report: any, index: number) => {
      const date = new Date(report.creationDate);
      if (index < reports.length - 1) {
        const nextDate = new Date(reports[index + 1].creationDate);
        // current date should be greater than next (descending order)
        expect(date.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });
  });

  it('Sort relationships alphabetically', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '-123.16415494128611,49.19908457340384,-123.07306537425993,49.253083517106205',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: 'creationDate,name',
      });
    expect(res.body.relationships.length).toEqual(3);
    expect(res.body.relationships[0].name).toEqual('Jane Doe');
    expect(res.body.relationships[1].name).toEqual('Kristofer Volkman');
    expect(res.body.relationships[2].name).toEqual('Xavier Cowan');
    const { relationships } = res.body;
    relationships.forEach((report: any, index: number) => {
      const currentName = report.name;
      if (index < relationships.length - 1) {
        const nextName = relationships[index + 1].name;
        // current should be less than next
        expect(currentName.localeCompare(nextName)).toEqual(-1);
      }
    });
  });

  it('Sort relationships by last contacted', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '-123.16415494128611,49.19908457340384,-123.07306537425993,49.253083517106205',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: 'creationDate,lastContacted',
      });
    expect(res.body.relationships.length).toEqual(3);
    expect(res.body.relationships[0].name).toEqual('Kristofer Volkman');
    expect(res.body.relationships[1].name).toEqual('Jane Doe');
    expect(res.body.relationships[2].name).toEqual('Xavier Cowan');
    const { relationships } = res.body;
    relationships.forEach((report: any, index: number) => {
      const date = new Date(report.lastContacted);
      if (index < relationships.length - 1) {
        const nextDate = new Date(relationships[index + 1].lastContacted);
        // current date should be greater than next (descending order)
        expect(date.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
    });
  });

  it('Sort relationships by first contacted', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '-123.16415494128611,49.19908457340384,-123.07306537425993,49.253083517106205',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: 'creationDate,firstContacted',
      });
    expect(res.body.relationships.length).toEqual(3);
    expect(res.body.relationships[0].name).toEqual('Xavier Cowan');
    expect(res.body.relationships[1].name).toEqual('Jane Doe');
    expect(res.body.relationships[2].name).toEqual('Kristofer Volkman');
    const { relationships } = res.body;
    relationships.forEach((report: any, index: number) => {
      const date = new Date(report.lastContacted);
      if (index < relationships.length - 1) {
        const nextDate = new Date(relationships[index + 1].lastContacted);
        // current date should be greater than next (descending order)
        expect(date.getTime()).toBeLessThanOrEqual(nextDate.getTime());
      }
    });
  });

  it('Check all results are within bounding box', async () => {
    const res = await request(server)
      .get('/alldata')
      .query({
        query: '',
        box: '-123.15250898347264,49.26790260640351,-123.10015521863093,49.298902505220866',
        time: '0,64,2016,5,2021,9,64',
        sortOrderParams: '',
      });
    const latMin = 49.26790260640351;
    const latMax = 49.298902505220866;
    const lngMin = -123.15250898347264;
    const lngMax = -123.10015521863093;
    const { reports } = res.body;
    const { relationships } = res.body;
    expect(reports.length).toEqual(3);
    expect(relationships.length).toEqual(4);
    reports.forEach((report: any) => {
      const coords = report.location.coordinates[0];
      coords.forEach((point: number[]) => {
        const lng = point[0];
        const lat = point[1];
        expect(lng).toBeLessThanOrEqual(lngMax);
        expect(lng).toBeGreaterThanOrEqual(lngMin);
        expect(lat).toBeLessThanOrEqual(latMax);
        expect(lat).toBeGreaterThanOrEqual(latMin);
      });
    });
    relationships.forEach((relationship: any) => {
      const coords = relationship.location.coordinates;
      const lng = coords[0];
      const lat = coords[1];
      expect(lng).toBeLessThanOrEqual(lngMax);
      expect(lng).toBeGreaterThanOrEqual(lngMin);
      expect(lat).toBeLessThanOrEqual(latMax);
      expect(lat).toBeGreaterThanOrEqual(latMin);
    });
  });

  it('Combination of search, filter, sort criteria', async () => {
    const dateFrom = new Date('July 1, 2017');
    const dateTo = new Date('September 1, 2020');
    const res = await request(server)
      .get('/alldata')
      .query({
        query: 'Recreation',
        box: '-123.15190918987591,49.223218655898904,-123.04720166019248,49.285255107721326',
        time: '14,52,2016,5,2021,9,64',
        sortOrderParams: 'creationDate,name',
      });
    expect(res.statusCode).toEqual(200);
    // Check number of results
    expect(res.body.reports.length).toEqual(6);
    expect(res.body.relationships.length).toEqual(1);
    const { relationships } = res.body;
    const { reports } = res.body;
    reports.forEach((report: any, index: number) => {
      // Check time filter - Jul 2017-Sep 2020
      const date = new Date(report.creationDate);
      expect(date.getTime()).toBeGreaterThanOrEqual(dateFrom.getTime());
      expect(date.getTime()).toBeLessThanOrEqual(dateTo.getTime());
      // Check reports sorted by date
      if (index < reports.length - 1) {
        const nextDate = new Date(reports[index + 1].creationDate);
        // current date should be greater than next (descending order)
        expect(date.getTime()).toBeGreaterThanOrEqual(nextDate.getTime());
      }
      // Check report tags
      const { tags } = report;
      expect(tags).toContain('Recreation');
    });
    // Check keywords for relationships
    relationships.forEach((relationship: any) => {
      const { tags } = relationship;
      expect(tags).toContain('Recreation');
    });
    // Check location of reports and relationships are within bounding box
    const latMin = 49.223218655898904;
    const latMax = 49.285255107721326;
    const lngMin = -123.15190918987591;
    const lngMax = -123.04720166019248;
    reports.forEach((report: any) => {
      const coords = report.location.coordinates[0];
      coords.forEach((point: number[]) => {
        const lng = point[0];
        const lat = point[1];
        expect(lng).toBeLessThanOrEqual(lngMax);
        expect(lng).toBeGreaterThanOrEqual(lngMin);
        expect(lat).toBeLessThanOrEqual(latMax);
        expect(lat).toBeGreaterThanOrEqual(latMin);
      });
    });
    relationships.forEach((relationship: any) => {
      const coords = relationship.location.coordinates;
      const lng = coords[0];
      const lat = coords[1];
      expect(lng).toBeLessThanOrEqual(lngMax);
      expect(lng).toBeGreaterThanOrEqual(lngMin);
      expect(lat).toBeLessThanOrEqual(latMax);
      expect(lat).toBeGreaterThanOrEqual(latMin);
    });
  });
});
