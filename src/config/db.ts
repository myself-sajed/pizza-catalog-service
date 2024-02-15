import mongoose from "mongoose";
import config from "config";

const initDB = async () => {
    await mongoose.connect(config.get("database.url"));
};

export default initDB;
