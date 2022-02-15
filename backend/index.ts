import express from 'express';

require('dotenv').config();

const app = express();
const PORT = 8000;
const mongoose = require('mongoose');
const cors = require('cors');
const ReportModel = require('./models/Reports');
const RelationshipModel = require('./models/Relationships');
const ProjectModel = require('./models/Projects');

// Convert body of JSON requests to an object
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_CONNECTION_TOKEN);

app.get('/', (req, res) => res.send('Express and TypeScript Server'));

app.get('/alldata', async (req, res) => {
  const queryParams = req.query;
  const keywords = (<string>queryParams.query).split(',').filter((s) => s !== '');
  const coordinates = (<string>queryParams.box).split(',').filter((s) => s !== '').map((x) => Number(x));
  const sortOn = (<string>queryParams.sortOn).split(',').filter((s) => s !== '');
  const sortReportsOn = sortOn[0];
  const sortRelationshipsOn = sortOn[1];

  // Expected behaviour is that if no filters are applied, no data is returned.
  if (keywords.length === 0 && coordinates.length === 0) {
    return res.status(200).json({
      reports: [],
      relationships: [],
    });
  }

  const lowerLeft = coordinates.slice(0, 2);
  const upperRight = coordinates.slice(2, 4);
  const polygon = [
    lowerLeft, [lowerLeft[0], upperRight[1]], upperRight, [upperRight[0], lowerLeft[1]], lowerLeft,
  ];

  const reportFilters = [];
  const relationshipFilters = [];

  if (keywords.length > 0) {
    const KEYWORDS_FILTER = { tags: { $all: keywords } };

    reportFilters.push(KEYWORDS_FILTER);
    relationshipFilters.push(KEYWORDS_FILTER);
  }

  if (coordinates.length > 0) {
    const BOUNDING_BOX_FILTER = {
      location: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon',
            coordinates: [polygon],
          },
        },
      },
    };

    reportFilters.push(BOUNDING_BOX_FILTER);
    relationshipFilters.push(BOUNDING_BOX_FILTER);
  }

  const reportSortOrder = -1; // Descending by default
  let reportSort = {};
  const relationshipSortOrder = 1;
  let relationshipSort = {};
  if (sortReportsOn === 'creationDate') {
    reportSort = { creationDate: reportSortOrder };
  } else if (sortReportsOn === 'name') {
    reportSort = { name: reportSortOrder };
  }

  if (sortRelationshipsOn === 'lastContacted') {
    relationshipSort = { lastContacted: relationshipSortOrder };
  } else if (sortRelationshipsOn === 'name') {
    relationshipSort = { name: relationshipSortOrder };
  }

  const REPORT_RESPONSE_FIELDS = {
    name: 1, relationships: 1, tags: 1, location: 1, creationDate: 1,
  };
  const RELATIOSHIP_RESPONSE_FIELDS = {
    name: 1, reports: 1, tags: 1, location: 1,
  };

  const reportQuery = ReportModel.find({
    $and: reportFilters,
    REPORT_RESPONSE_FIELDS,
  }).sort(reportSort);

  const relationshipQuery = RelationshipModel.find({
    $and: relationshipFilters,
    RELATIOSHIP_RESPONSE_FIELDS,
  }).sort(relationshipSort);

  return res.status(200).json({
    reports: await reportQuery,
    relationships: await relationshipQuery,
  });
});

app.get('/projects', (req, res) => {
  ProjectModel.find({}, (err: any, result: any) => {
    if (err) {
      res.status(500).send();
    } else {
      res.status(200).json(result);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});
