import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    customer: String,
    phone: String,
    address: String,
    note: String,
    total: Number,
    status: { type: String, default: 'Chờ xử lý' },
    items: Array, // Ideally sub-schema, but Array is fine for simple migration
    createdAt: { type: Date, default: Date.now }, // Explicitly track creation for sorting
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
