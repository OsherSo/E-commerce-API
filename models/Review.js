const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Please provide rating'],
    },
    title: {
      type: String,
      trim: true,
      required: [true, 'Please provide title'],
      maxLength: [50, ''],
    },
    comment: {
      type: String,
      trim: true,
      required: [true, 'Please provide comment'],
      maxLength: [200, ''],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, ''],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
      required: [true, ''],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
