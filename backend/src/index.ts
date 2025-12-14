import app from '@/server'
import dotenv from 'dotenv';
import { envConfig } from './config';

dotenv.config();
const PORT = envConfig.PORT! || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});