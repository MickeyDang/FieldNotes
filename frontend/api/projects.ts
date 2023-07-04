import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createMongoDBDataAPI } from 'mongodb-data-api';

const api = createMongoDBDataAPI({
  apiKey: process.env.DATA_API_KEY,
  urlEndpoint: process.env.DATA_API_URL,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const projectCollection = api.$cluster('Cluster0').$database('Main').$collection<any>('projects');
  if (req.method === 'PUT') {
    const { repIds, relIds } = req.body;
    // TODO: Hardcoded P.O.C.
    const id = '64a3d65d50e980c2fbee11fa';

    const updatedProject = await projectCollection.updateOne({
      filter: { _id: { $oid: id } },
      update: {
        $set: {
          reports: repIds.map((x: any) => ({ $oid: x })),
          relationships: relIds.map((x: any) => ({ $oid: x })),
        },
      },
    });

    return res.status(200).json({
      updatedProject,
    });
  }
  // Handles the GET case
  const project = (await projectCollection.find({})).documents[0];
  return res.status(200).json({
    project,
  });
}