import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'c4fusx3t',
  api_key: process.env.CLOUDINARY_API_KEY || '847247248623345',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'l_CvdlM9_X2jJNwCDIY7_yJrMeY',
});

export default cloudinary;