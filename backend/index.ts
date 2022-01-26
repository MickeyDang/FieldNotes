import express from 'express';

const app = express();
const PORT = 8000;
const mongoose = require('mongoose');
const ReportModel = require('./models/Reports');
const RelationshipModel = require('./models/Relationships');
const ProjectModel = require('./models/Projects');

// Convert body of JSON requests to an object
app.use(express.json())

mongoose.connect('mongodb+srv://fydpTeam:figgiRocks99@cluster0.fgosq.mongodb.net/fieldNotes?retryWrites=true&w=majority')

app.get('/', (req, res) => res.send('Express and TypeScript Server'));

// Return all documents in reports collection
app.get('/getReports', (req, res) => {
  ReportModel.find({}, (err: any, result: any) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    }
  })
})

// Add new report to Reports collection
app.post('/createReport', async (req, res) => {
  const report = req.body;
  const newReport = new ReportModel(report);
  await newReport.save();

  res.json(report)
})

app.listen(PORT, () => {
  console.log(`Server is running at https://localhost:${PORT}`);
});
