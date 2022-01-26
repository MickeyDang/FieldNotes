const mongoose = require("mongoose");

const contactInformationSchema = new mongoose.Schema({
  website: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
});

const relatedReportsSchema = new mongoose.Schema({
  reportIDs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ReportModel",
  },
  reportNames: {
    type: [String],
  },
});

// GeoJSON schema based on: https://mongoosejs.com/docs/geojson.html
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const relationshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Person", "Organization"],
  },
  contact: contactInformationSchema,
  contactedBy: {
    type: String,
    enum: ["GV", "PRC", "UZD"],
  },
  lastContacted: {
    type: Date,
  },
  description: {
    type: String,
  },
  reports: relatedReportsSchema,
  location: pointSchema,
});

const RelationshipModel = mongoose.model("relationships", relationshipSchema);
module.exports = RelationshipModel;
