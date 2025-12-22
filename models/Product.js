import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID for compatibility with existing frontend logic
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    category: { type: String, required: true },
    image: String,
    desc: String,
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    reviews: [
        {
            user: { type: String, required: true },
            rating: { type: Number, required: true },
            comment: { type: String, required: true },
            date: { type: String, required: true } // Storing as string for simplicity in Mock
        }
    ]
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
