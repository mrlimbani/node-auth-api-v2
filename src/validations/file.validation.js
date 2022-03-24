const multer = require('multer');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

const upload = multer({dest:'uploads/'}).single("image");



module.exports = { upload, }