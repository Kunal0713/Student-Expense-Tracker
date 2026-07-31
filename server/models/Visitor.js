import mongoose from 'mongoose';

const visitorSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now
    },

    ip: {
      type: String,
      trim: true
    },

    browser: {
      type: String,
      trim: true
    },

    os: {
      type: String,
      trim: true
    },

    device: {
      type: String,
      trim: true
    },

    userAgent: {
      type: String,
      trim: true
    }
  },
  {
    versionKey: false
  }
);

const Visitor = mongoose.model('Visitor', visitorSchema);

export default Visitor;