import mongoose from "mongoose";

// Connect to MongoDB
const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Connected To Database');
    } catch (error) {
        console.log(error);
    }
}


export default dbConnection;