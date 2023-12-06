const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Please provide product name'],
      maxLength: [50, 'Name can not be more than 50 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide product price'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide product description'],
      maxLength: [200, 'Description can not be more than 50 characters'],
    },
    image: {
      type: String,
      default: '/uploads/example.jpeg',
    },
    category: {
      type: String,
      required: [true, 'Please provide product category'],
      enum: {
        values: ['office', 'kitchen', 'bedroom'],
        message: '{VALUE} is not supported',
      },
    },
    company: {
      type: String,
      required: [true, 'Please provide product company'],
      enum: {
        values: ['ikea', 'liddy', 'marcos'],
        message: '{VALUE} is not supported',
      },
    },
    colors: {
      type: [String],
      default: ['#222'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
