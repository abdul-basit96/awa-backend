const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require('path')

const videoUpload = multer({
    storage: multer.diskStorage({
        destination: 'public/videos',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname))
        }
    })
});

const imageUpload = multer({
    storage: multer.diskStorage({
        destination: 'public/images',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname))
        }
    })
});

router.post("/upload-video",
    videoUpload.single('file'),
    (req, res) => {
        res.send(req.file)
    }, (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    });

router.post("/upload-image",
    imageUpload.single('file'),
    (req, res) => {
        res.send(req.file)
    }, (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    });

module.exports = router;


