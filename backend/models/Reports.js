const mongoose = require("mongoose");

const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true,
  },
  coordinates: {
    type: [[[Number]]], // Array of arrays of arrays of numbers
    required: true,
  },
});

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tags: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
  department: {
    type: String,
    enum: ["GV", "PRC", "UZD"],
  },
  methods: [
    {
      type: String,
      enum: ["TH", "FG", "WK", "QS", "OS"],
    },
  ],
  contacts: [
    {
      type: String,
    },
  ],
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectModel",
  },
  relationships: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RelationshipModel",
    },
  ],
  location: polygonSchema,
});

const ReportModel = mongoose.model("reports", reportSchema);
module.exports = ReportModel;
