import express from 'express';
import { deleteImage, getImages, postImage } from './handlers/misc';
import { existsSync, mkdirSync } from 'fs';
import fileUpload from 'express-fileupload';
import { dbSync } from './handlers/sync';

// create images directory
if (!existsSync("images")){
    mkdirSync("images");
}

// Server setup
const app = express();
const SERVER_PORT = 6002;
app.use(express.json());
app.use(fileUpload());

// Endpoints
app.get("/images", getImages);
app.post("/images", postImage);
app.delete("/images", deleteImage);
app.get("/sync", dbSync)

/*
/stats GET
    returns number of images and total size
/images GET
    returns paths of all images in images folder
/sync GET
    returns images deleted from and added to MongoDB server
/images/{...}/filename.ext POST
    uploads image to specified directory
    returns MongoDB object
/images/{...}/filename.ext DELETE
    deletes image in specified directory
    deletes any empty directories
    returns deleted MongoDB object
/images/{...}/filename.ext GET
    returns raw image
*/

// Actually start listening to desired port
app.listen(SERVER_PORT, () => console.log(`Running on ${SERVER_PORT}...`));