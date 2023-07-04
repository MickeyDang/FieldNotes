import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createMongoDBDataAPI } from 'mongodb-data-api';
import { Types } from 'mongoose';

// init by URL Endpoint
const api = createMongoDBDataAPI({
  apiKey: process.env.DATA_API_KEY,
  urlEndpoint: process.env.DATA_API_URL,
});

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const projectCollection = api.$cluster('Cluster0').$database('Main').$collection<any>('projects');
  const reportCollection = api.$cluster('Cluster0').$database('Main').$collection<any>('reports');
  const relationshipCollection = api.$cluster('Cluster0').$database('Main').$collection<any>('relationships');

  const project = (await projectCollection.find({
    filter: {},
  })).documents[0];

  // TODO: the issue is that these ids are strings and not mongo ids so they don't get filtered.
  const repIds = ((project && project.reports) ?? []).map((x: any) => new Types.ObjectId(x));
  const relIds = ((project && project.relationships) ?? []).map((x: any) => new Types.ObjectId(x));

  const reports = (await reportCollection.find({
    filter: {
      _id: { $in: repIds },
    },
  })).documents;

  const relationships = (await relationshipCollection.find({
    filter: {
      _id: { $in: relIds },
    },
  })).documents;

  return res.status(200).json({
    reports,
    relationships,
  });
}
