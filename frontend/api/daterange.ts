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
  const reportCollection = api.$cluster('Cluster0').$database('Main').$collection<any>('reports');

  const oldest = reportCollection.find({
    filter: {},
    sort: { creationDate: 1 },
    limit: 1,
  });

  const newest = reportCollection.find({
    filter: {},
    sort: { creationDate: -1 },
    limit: 1,
  });

  return res.status(200).json({
    oldestDate: (await oldest).documents,
    newestDate: (await newest).documents,
  });
}
