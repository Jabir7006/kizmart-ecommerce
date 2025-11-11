

import dotenv from "dotenv";
import connectDB from "./modules/config/db.js";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await connectDB();
});
