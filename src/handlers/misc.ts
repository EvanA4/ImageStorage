import { Request, Response } from "express";
import dbConnect from "../utils/dbconnect";
import { IImage, Image } from "../models/Image";
import fileUpload from "express-fileupload";
import { imageSize } from "image-size";
import { rmSync, writeFileSync } from "fs";
import { resolve } from "path";


export async function getImages(req: Request, res: Response) {
    await dbConnect();
    if (!req.query._id) {
        // could have a reviewId
        if (req.query.reviewId) {
            const images = (await Image.find({
                reviewId: req.query.reviewId
            })) as IImage[];
            res.send({
                error: false,
                message: `Successfully retrieved ${images.length} image(s).`,
                value: images
            });

        } else {
            // if no specified ID, just get all documents
            const images = (await Image.find()) as IImage[];
            res.send({
                error: false,
                message: `Successfully retrieved ${images.length} image(s).`,
                value: images
            });
        }

    } else {
        // if specified ID, fetch either document or image file
        let image = (await Image.findById(req.query._id)) as IImage;
        if (!image) {
            res.status(400).send({
                error: true,
                message: `Invalid _id query parameter.`
            });
            return;
        }

        if (req.query.doc && req.query.doc == "true") {
            res.send({
                error: false,
                message: `Successfully retrieved image.`,
                value: image
            });
            return;
            
        } else {
            // get image file
            res.type(image.extension).sendFile(resolve(`images/${req.query._id}`));
        }
    }
};

export async function postImage(req: Request, res: Response) {
    // console.log(`req.files: ${JSON.stringify(req.files)}`);
    // console.log(`req.params: ${JSON.stringify(req.query)}`);
    // console.log(`req.body: ${JSON.stringify(req.body)}`);

    if (!req.body || !req.body.password) {
        res.status(400).send({
            error: true,
            message: "No password field in body",
        });
        return;
    }

    if (req.body.password !== process.env.PASSWORD) {
        res.status(400).send({
            error: true,
            message: "Incorrect password",
        });
        return;
    }

    if (!req.files || !req.files.images) {
        res.status(400).send({
            error: true,
            message: "No files uploaded",
        });
        return;
    }
    
    // messing around with types, ending with array of images
    let uploaded: fileUpload.UploadedFile[];
    if ((req.files as any).length) {
        uploaded = req.files.images as fileUpload.UploadedFile[];
    } else {
        uploaded = [req.files.images] as fileUpload.UploadedFile[];
    }
    
    // add each image
    await dbConnect();
    const newImages: IImage[] = [];
    for (let i = 0; i < uploaded.length; ++i) {
        // determine image size and type
        const size = imageSize(uploaded[i].data);
        if (!size.type) continue;

        // create MongoDB image object
        const toAdd: IImage = {
            reviewId: req.body.reviewId,
            md5: uploaded[i].md5,
            name: uploaded[i].name,
            extension: size.type,
            size: uploaded[i].size,
            width: size.width,
            height: size.height
        };

        // upload object to database
        const added = (await Image.insertOne(toAdd)) as IImage;
        newImages.push(added);

        // create file
        writeFileSync("images/" + added._id!, uploaded[i].data);
    }

    res.send({
        error: true,
        message: `Successfully uploaded ${newImages.length} file(s)`,
        value: newImages
    });
};


export async function deleteImage(req: Request, res: Response) {
    // console.log(`req.params: ${JSON.stringify(req.query)}`);

    if (!req.body || !req.body.password) {
        res.status(400).send({
            error: true,
            message: "No password field in body",
        });
        return;
    }

    if (req.body.password !== process.env.PASSWORD) {
        res.status(400).send({
            error: true,
            message: "Incorrect password",
        });
        return;
    }

    if (!req.query._id && !req.query.reviewId) {
        res.status(400).send({
            error: true,
            message: "Missing _id or reviewId query parameter"
        });
        return;
    }

    await dbConnect();
    if (req.query._id) {
        const deleted = await Image.findByIdAndDelete(req.query._id);
        if (!deleted) {
            res.status(400).send({
                error: true,
                message: `Invalid _id query parameter`,
            });
            return;
        }
    
        rmSync(`images/${req.query._id}`);
    
        res.send({
            error: false,
            message: "Successfully deleted image",
            value: deleted
        });

    } else {
        const toDelete = await Image.find({ reviewId: req.query.reviewId }) as IImage[];
        toDelete.forEach(val => {
            (async () => {
                await Image.findByIdAndDelete(val._id);
                rmSync(`images/${val._id}`);
            })();
        });
    
        res.send({
            error: false,
            message: `Successfully deleted ${toDelete.length} image(s)`,
            value: toDelete
        });
    }
};