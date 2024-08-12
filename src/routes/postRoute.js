const express = require('express')
const postRoute = express.Router();
const postController = require('../controllers/postController')
const middleware = require('../middlewares/authMiddleware')
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })


postRoute.post('/upload', middleware.verifyToken, upload.single('file'), postController.uploadPost)


module.exports = postRoute;