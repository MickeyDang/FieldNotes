import type { VercelRequest, VercelResponse } from '@vercel/node';

const mongoose = require('mongoose');
const ReportModel = require('./models/Reports');
const RelationshipModel = require('./models/Relationships');
const ProjectModel = require('./models/Projects');

mongoose.connect(process.env.DATABASE_CONNECTION_TOKEN);
mongoose.set('strictQuery', true);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
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
}
