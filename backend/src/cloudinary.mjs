import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

import { Readable } from "stream";

import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: "mangrover",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// TODO: organize this by including options as well. /<anime-id>/<season-id>/<episode-id>
export async function uploadVideo(filePath) {
    return new Promise((resolve, reject) => {
        const readStream = fs.createReadStream(filePath, {});
        const uploadStream = cloudinary.uploader.upload_stream({
            resource_type: "video",
        }, function(err, result) {
            if (err) {
                // console.log("upload error -", err);
                reject(err);
            }
    
            if (result) {
                // console.log("upload complete", result);
                resolve(result);
            }
        });
        readStream.pipe(uploadStream);
    });
}

export async function uploadAvatar(buffer, userId) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            public_id: `/avatars/${userId}`,
            overwrite: true,
            invalidate: true,
            resource_type: "image",
            folder: "avatars"
        }, function(error, result) {
            if (error) {
                // console.error("Error in uploading avatart", error);
                reject(error);
            }
            if (result) {
                // console.log("Avatar uploaded", result);
                resolve(result);
            }
        })
        Readable.from(buffer).pipe(uploadStream);
    });
}
