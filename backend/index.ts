import express from 'express';

const url = require('url');

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
  // TODO: extract the filter information from the query parameters.
  // TODO: construct the database querries.
  // TODO: format the response of reports and relationships.

  const queryObject = url.parse(req.url, true).query;

  const { boundingBox } = queryObject;
  const lowerLeft = Array.from(boundingBox[0].split(','), (x) => Number(x));
  const upperRight = Array.from(boundingBox[1].split(','), (x) => Number(x));
  const polygon = [
    lowerLeft, [lowerLeft[0], upperRight[1]], upperRight, [upperRight[0], lowerLeft[1]], lowerLeft,
  ];
  const { keywords } = queryObject;

  let queryReports;
  let queryRelationships;

  if (boundingBox && keywords) {
    queryRelationships = RelationshipModel.find({
      $and: [{
        location: { $geoWithin: { $box: [lowerLeft, upperRight] } },
      }, { tags: { $all: keywords } }],
    });

    queryReports = ReportModel.find({
      $and: [
        {
          location: {
            $geoWithin: {
              $geometry: {
                type: 'Polygon',
                coordinates: [polygon],
              },
            },
          },
        }, { tags: { $all: keywords } }],
    }, {
      lastUpdated: 0, department: 0, methods: 0, description: 0, 
    }).sort({ creationDate: -1 });
  } else if (keywords) {
    queryReports = ReportModel.find(
      { tags: { $all: keywords } },
      {
        lastUpdated: 0, department: 0, methods: 0, description: 0,
      },
    ).sort({ creationDate: -1 });

    queryRelationships = RelationshipModel.find({ tags: { $all: keywords } });
  } else if (boundingBox) {
    queryRelationships = RelationshipModel.find({
      location: { $geoWithin: { $box: [lowerLeft, upperRight] } },
    });

    queryRelationships = RelationshipModel.find(
      {
        location: {
          $geoWithin: {
            $geometry: {
              type: 'Polygon',
              coordinates: [polygon],
            },
          },
        },
      },
    ).sort({ creationDate: -1 });
  }

  const reports = await queryReports;
  const relationships = await queryRelationships;

  res.status(200).json({
    reports,
    relationships,
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
