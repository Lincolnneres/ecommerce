const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      image: String,
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: 'pendente' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);