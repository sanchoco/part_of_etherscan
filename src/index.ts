import app from './app';
import { PORT } from './config';

app.listen(PORT, () => {
  console.log(`server is listening in http://localhost:${PORT}`);
})