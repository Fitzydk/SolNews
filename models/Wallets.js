import mongoose from 'mongoose'

const WalletsSchema = new mongoose.Schema(
    {
        lastonline: {
            type: Date,
            required: false,
        },
        address: {
            type: String,
            require: true,
        },
    }, 
    {
        timestamps: true,
        collection: "wallets"
    },
);

// if not exists than create a table but if exists than
export default mongoose.models.Wallets || mongoose.model("Wallets", WalletsSchema);