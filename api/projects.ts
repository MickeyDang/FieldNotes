import type { VercelRequest, VercelResponse } from '@vercel/node';

const mongoose = require('mongoose');
const ProjectModel = require('./models/Projects');

mongoose.connect(process.env.DATABASE_CONNECTION_TOKEN);
mongoose.set('strictQuery', true);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method === 'PUT') {
    const { repIds, relIds } = req.body;
    // Hardcoded P.O.C.
    const id = '64a3d65d50e980c2fbee11fa';

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
  }
  // Handles the GET case
  const project = (await ProjectModel.find({}))[0];
  return res.status(200).json({
    project,
  });
}
