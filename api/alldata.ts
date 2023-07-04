import type { VercelRequest, VercelResponse } from '@vercel/node';

const mongoose = require('mongoose');
const ReportModel = require('./models/Reports');
const RelationshipModel = require('./models/Relationships');

const {
  getDateWithAddedMonths,
  getRelSortOrder,
  getReportSortOrder,
  REPORT_RESPONSE_FIELDS,
  RELATIOSHIP_RESPONSE_FIELDS,
  /* eslint-disable import/no-unresolved, import/extensions */
} = require('./helpers');
/* eslint-enable import/no-unresolved, import/extensions */

mongoose.connect(process.env.DATABASE_CONNECTION_TOKEN);
mongoose.set('strictQuery', true);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
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
}
