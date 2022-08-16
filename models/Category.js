import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema(
    {
        category: {
            type: String,
            require: true,
        }
    },
    { collection: "categories" }
);
// if not exists than create a table but if exists than
export default mongoose.models.Categories || mongoose.model("Categories", CategorySchema);