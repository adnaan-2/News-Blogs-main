import { v2 as cloudinary } from 'cloudinary';

// Temporarily hard-code for testing
cloudinary.config({
  cloud_name: 'domensaip', // Hard-coded for testing
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default cloudinary;