import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  itemType: {
    type: String,
    required: true
  },
  category: String,
  quantity: {
    type: Number,
    required: true
  },
  measurementType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Sale || mongoose.model('Sale', saleSchema);