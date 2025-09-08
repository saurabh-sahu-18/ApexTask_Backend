import express from "express";
import cors from "cors";
import notesRoutes from "./routes/notesRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();

let isConnected = false;

const connectToMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log("Mongodb Connected Successfully");
    } catch (error) {
        console.error("Error connecting to mongodb", error);
        process.exit(1);
    }
}

const allowedOrigins = [
  "http://localhost:5173",
  "https://apex-task-frontend.vercel.app",
];

//middleware
app.use(cors({
  origin: allowedOrigins,
}));
app.use(express.json());  // this middleware will parse JSON bodies: req.body
app.use(rateLimiter);

app.use((req, res, next) => {
  if(!isConnected) {
    connectToMongoDB();
  }
  next();
});

app.use("/api/notes", notesRoutes);

export default app;

// connectDB().then(() => {
//   app.listen(PORT, () => {
//     console.log("Server started on PORT:", PORT);
//   });
// });