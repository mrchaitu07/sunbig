// FileSet.js - Updated Schema
const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserInfo',
    required: true
  },
  files: [{
    filename: String,
    originalName: String,
    fileType: {
      type: String,
      enum: ['image', 'pdf']
    },
    documentType: {
      type: String,
      enum: ['panCard', 'aadharCard', 'salarySlip', 'itr']
    },
    mimeType: String,
    url: String,
    path: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

module.exports = mongoose.model('FileSet', fileSchema);