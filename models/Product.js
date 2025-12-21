import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID for compatibility with existing frontend logic
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: String,
    desc: String,
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
