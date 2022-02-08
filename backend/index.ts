import express from 'express';
// import { type } from 'os';

// const url = require('url');

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

  const keywords = [queryParams.query];
  const coordinates = Array.from((<string>queryParams.box).split(','), (x) => Number(x));
  const lowerLeft = coordinates.slice(0, 2);
  const upperRight = coordinates.slice(2, 4);
  const polygon = [
    lowerLeft, [lowerLeft[0], upperRight[1]], upperRight, [upperRight[0], lowerLeft[1]], lowerLeft,
  ];

  let queryReports;
  let queryRelationships;

  if (keywords[0] && coordinates[0]) {
    queryRelationships = RelationshipModel.find({
      $and: [{
        location: { $geoWithin: { $box: [lowerLeft, upperRight] } },
      }, { tags: { $all: keywords } }],
    }, {
      name: 1, reports: 1, tags: 1, location: 1,
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
      name: 1, relationships: 1, tags: 1, location: 1,
    }).sort({ creationDate: -1 });
  } else if (keywords[0]) {
    queryReports = ReportModel.find(
      { tags: { $all: keywords } },
      {
        name: 1, relationships: 1, tags: 1, location: 1,
      },
    ).sort({ creationDate: -1 });

    queryRelationships = RelationshipModel.find({ tags: { $all: keywords } }, {
      name: 1, reports: 1, tags: 1, location: 1,
    });
  } else if (coordinates[0]) {
    queryRelationships = RelationshipModel.find({
      location: { $geoWithin: { $box: [lowerLeft, upperRight] } },
    }, {
      name: 1, reports: 1, tags: 1, location: 1,
    });

    queryReports = ReportModel.find(
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
      {
        name: 1, relationships: 1, tags: 1, location: 1,
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
