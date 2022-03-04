require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8000;
const mongoose = require('mongoose');
const cors = require('cors');
const ReportModel = require('./models/Reports');
const RelationshipModel = require('./models/Relationships');
const ProjectModel = require('./models/Projects');
const {
  getDateWithAddedMonths,
  getRelSortOrder,
  getReportSortOrder,
  REPORT_RESPONSE_FIELDS,
  RELATIOSHIP_RESPONSE_FIELDS,
  /* eslint-disable import/no-unresolved, import/extensions */
} = require('./helpers');
/* eslint-enable import/no-unresolved, import/extensions */

// Convert body of JSON requests to an object
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_CONNECTION_TOKEN);

app.get('/', (req: any, res: any) => res.send('Express and TypeScript Server'));

app.get('/alldata', async (req: any, res: any) => {
  const queryParams = req.query;
  const keywords = (<string>queryParams.query).split(',').filter((s) => s !== '');
  const coordinates = (<string>queryParams.box).split(',').filter((s) => s !== '').map((x) => Number(x));
  const timeRange = (<string>queryParams.time).split(',').filter((s) => s !== '').map((x) => Number(x));
  const sortOrderParams = (<string>queryParams.sortOrderParams).split(',').filter((s) => s !== '');

  // Expected behaviour is that if no filters are applied, no data is returned.
  if (keywords.length === 0 && coordinates.length === 0 && queryParams.time === 'undefined') {
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

  if (queryParams.time !== 'undefined' && timeRange.length > 6) {
    const startDate = timeRange.slice(2, 4);
    const endDate = timeRange.slice(4, 6);
    const lowerRange = getDateWithAddedMonths(
      new Date(startDate[0], startDate[1], 1),
      timeRange[0] - 1,
    );
    const upperRange = getDateWithAddedMonths(
      new Date(endDate[0], endDate[1], 1),
      -((timeRange[6] - timeRange[1]) + 1),
    );
    const TIME_RANGE_FILTER = {
      creationDate: {
        $gte: lowerRange,
        $lt: upperRange,
      },
    };

    reportFilters.push(TIME_RANGE_FILTER);
  }

  const reportSortOrderParams = sortOrderParams[0];
  const relSortOrderParams = sortOrderParams[1];
  const reportSortOrder = getReportSortOrder(reportSortOrderParams);
  const relSortOrder = getRelSortOrder(relSortOrderParams);

  const searching = (keywords.length > 0 || coordinates.length > 0);
  const reportQuery = (reportFilters.length > 0 && searching)
    ? ReportModel.find({
      $and: reportFilters,
      REPORT_RESPONSE_FIELDS,
    }).sort(reportSortOrder)
    : [];

  const relationshipQuery = (relationshipFilters.length > 0 && searching)
    ? RelationshipModel.find({
      $and: relationshipFilters,
      RELATIOSHIP_RESPONSE_FIELDS,
    }).sort(relSortOrder)
    : [];

  return res.status(200).json({
    reports: await reportQuery,
    relationships: await relationshipQuery,
  });
});

app.get('/daterange', async (req: any, res: any) => {
  const oldest = ReportModel.find({}, { creationDate: 1 }).sort({ creationDate: 1 }).limit(1);
  const newest = ReportModel.find({}, { creationDate: 1 }).sort({ creationDate: -1 }).limit(1);

  return res.status(200).json({
    oldestDate: await oldest,
    newestDate: await newest,
  });
});

app.get('/projects/:id', async (req: any, res: any) => {
  // In theory, we would extract the project id, but for prototype, we only have one project.
  const project = (await ProjectModel.find({}))[0];
  return res.status(200).json({
    project,
  });
});

app.put('/projects/:id', async (req: any, res: any) => {
  const { repIds, relIds } = req.body;
  const { id } = req.params;

  const updatedProject = await ProjectModel.findByIdAndUpdate(
    id,
    {
      reports: repIds,
      relationships: relIds,
    },
    { new: true },
  );

  return res.status(200).json({
    updatedProject,
  });
});

app.get('/projectdata/:id', async (req: any, res: any) => {
  // In theory, we would extract the project id, but for prototype, we only have one project.
  const project = (await ProjectModel.find({}))[0];
  const repIds = project.reports;
  const relIds = project.relationships;

  const reports = await ReportModel.find({
    _id: { $in: repIds },
  });

  const relationships = await RelationshipModel.find({
    _id: { $in: relIds },
  });

  return res.status(200).json({
    reports,
    relationships,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});
