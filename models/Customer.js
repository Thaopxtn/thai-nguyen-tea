import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Use phone as ID or generic ID
    phone: { type: String, required: true, unique: true },
    name: String,
    address: String,
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: Date,
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
