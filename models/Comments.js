import mongoose from 'mongoose'

const CommentsSchema = new mongoose.Schema(
    {
        comment: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            require: true,
        },
        article: {
            type: String,
            required: true,
        },
    }, 
    {
        timestamps: true,
        collection: "comments"
    },
);

// if not exists than create a table but if exists than
export default mongoose.models.Comments || mongoose.model("Comments", CommentsSchema);