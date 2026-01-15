import app from './app.js';
import { PORT } from './constants/env.js';

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
