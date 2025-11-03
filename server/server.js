import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
	console.log(`Server is running on port ${PORT}`);
	await connectDB();
});
