import mongoose from 'mongoose';

const NewsSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: String,
    excerpt: String,
    date: String,
    image: String,
    content: String,
}, { timestamps: true });

export default mongoose.models.News || mongoose.model('News', NewsSchema);
