const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    enum: ["GV", "PRC", "UZD"],
  },
  createdDate: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
  },
  reports: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ReportModel",
    },
  ],
  researchStatus: {
    type: String,
    enum: [
      "Active",
      "In Progress",
      "Completed",
      "Inactive",
      "On Hold",
      "Cancelled",
    ],
  },
  relationships: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RelationshipModel",
    },
  ],
});

const ProjectModel = mongoose.model("projects", projectSchema);
module.exports = ProjectModel;
