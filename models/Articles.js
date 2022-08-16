import mongoose from 'mongoose'

const ArticlesSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        categories: {
            type: [String],
            required: true,
        },
    }, 
    {
        timestamps: true,
        collection: "articles"
    },
);

// if not exists than create a table but if exists than
export default mongoose.models.Articles || mongoose.model("Articles", ArticlesSchema);