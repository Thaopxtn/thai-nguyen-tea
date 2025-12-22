import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    customer: String,
    phone: String,
    address: String,
    note: String,
    total: Number,
    status: { type: String, default: 'Chờ xử lý' },
    cancelReason: String,
    items: Array, // Ideally sub-schema, but Array is fine for simple migration
    createdAt: { type: Date, default: Date.now }, // Explicitly track creation for sorting
}, { timestamps: true });

// Prevent Mongoose OverwriteModelError
// In development, we might want to delete the model to apply schema changes
if (process.env.NODE_ENV === 'development' && mongoose.models.Order) {
    delete mongoose.models.Order;
}

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
