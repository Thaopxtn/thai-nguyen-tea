import mongoose from 'mongoose';

const VisitorLogSchema = new mongoose.Schema({
    ip: String,
    city: String,
    country: String,
    device: String, // Mobile/Desktop/Tablet
    path: String,
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.VisitorLog || mongoose.model('VisitorLog', VisitorLogSchema);
