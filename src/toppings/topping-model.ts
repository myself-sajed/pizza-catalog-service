import mongoose from "mongoose";

const toppingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    tenantId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isPublish: {
        type: Boolean,
        required: false,
        default: false,
    },
});

export default mongoose.model("Topping", toppingSchema);
