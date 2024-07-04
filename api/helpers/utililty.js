import fs from 'fs';
import path from 'path';

const createUploadDir = () => {
  const uploadDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

export default createUploadDir;
