const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "Chat-App",
    resource_type: "image",
    format: file.mimetype.split("/")[1], // jpg/png
  }),
});

module.exports = {
  cloudinary,
  storage,
};