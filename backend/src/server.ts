import app from './app.js';
import connectDB from './config/db.js';
import { PORT } from './constants/env.js';
import { startDiscountWorker } from './workers/discountWorker.js';

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectDB();
  startDiscountWorker();
});
