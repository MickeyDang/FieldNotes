const mongoose = require("mongoose");

// GeoJSON schema based on: https://mongoosejs.com/docs/geojson.html
const polygonSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Polygon"],
    required: true,
  },
  coordinates: {
    type: [[[Number]]],
    required: true,
  },
});

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  description: {
    type: String,
  },
  creationDate: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
  department: {
    type: String,
    enum: ["GV", "PRC", "UZD"],
  },
  methods: {
    type: [String],
    enum: ["TH", "FG", "WK", "QS", "OS"],
  },
  contacts: {
    type: [String],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProjectModel",
  },
  relationships: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "RelationshipModel",
  },
  location: polygonSchema,
});

const ReportModel = mongoose.model("reports", reportSchema);
module.exports = ReportModel;
