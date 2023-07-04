import type { VercelRequest, VercelResponse } from '@vercel/node';

const mongoose = require('mongoose');
const ReportModel = require('./models/Reports');

mongoose.connect(process.env.DATABASE_CONNECTION_TOKEN);
mongoose.set('strictQuery', true);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const oldest = ReportModel.find({}, { creationDate: 1 }).sort({ creationDate: 1 }).limit(1);
  const newest = ReportModel.find({}, { creationDate: 1 }).sort({ creationDate: -1 }).limit(1);

  return res.status(200).json({
    oldestDate: await oldest,
    newestDate: await newest,
  });
}
