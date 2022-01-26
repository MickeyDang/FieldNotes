// import 'dotenv/config';
// import {DATABASE_CONNECTION_TOKEN} from '@env';
import express from 'express';

require('dotenv').config();

const app = express();
const PORT = 8000;
const mongoose = require('mongoose');
const ReportModel = require('./models/Reports');
const RelationshipModel = require('./models/Relationships');
const ProjectModel = require('./models/Projects');

const DATABASE_CONNECTION_TOKEN = 'mongodb+srv://fydpTeam:figgiRocks99@cluster0.fgosq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// Convert body of JSON requests to an object
app.use(express.json());

mongoose.connect(DATABASE_CONNECTION_TOKEN);

app.get('/', (req, res) => res.send('Express and TypeScript Server'));

app.get('/reports', (req, res) => {
  ReportModel.find({}, (err: any, result: any) => {
    res.json(err ?? result);
  });
});

app.get('/relationships', (req, res) => {
  RelationshipModel.find({}, (err: any, result: any) => {
    res.json(err ?? result);
  });
});

app.get('/projects', (req, res) => {
  ProjectModel.find({}, (err: any, result: any) => {
    res.json(err ?? result);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});
