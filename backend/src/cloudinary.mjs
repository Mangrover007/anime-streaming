import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import nodemailer from "nodemailer";

import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: "mangrover",
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET
});

export async function uploadVideo(filePath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath);
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: "video",
        }, function(err, result) {
            if (err) {
                console.log("upload error -", err);
                reject(err);
            }
    
            if (result) {
                console.log("upload complete", result);
                resolve(result);
            }
        });
        readStream.pipe(uploadStream);
    });
}
