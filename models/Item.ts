import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Plastic', 'Pital', 'Backlight Storage Box', 'Plastic Molding', 'Brass', 'Backolight']
  },
  category: {
    type: String,
    required: function() {
      return ['Plastic', 'Backlight Storage Box', 'Plastic Molding', 'Brass'].includes(this.type);
    }
  },
  quantity: {
    type: Number,
    required: true
  },
  measurementType: {
    type: String,
    required: true,
    enum: ['bags', 'kg', 'dozen', 'pieces']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Item || mongoose.model('Item', itemSchema);