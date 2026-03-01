import { Request, Response } from "express";
import dbConnect from "../utils/dbconnect";
import { Image } from "../models/Image";
import { readdirSync, rmSync } from "fs";

export async function dbSync(req: Request, res: Response) {
    if (!req.body || !req.body.password) {
        res.status(400).send({
            error: true,
            message: "No password field in body"
        });
        return;
    }

    if (req.body.password !== process.env.PASSWORD) {
        res.status(400).send({
            error: true,
            message: "Incorrect password"
        });
        return;
    }

    await dbConnect();
    const fileImages = new Set(readdirSync("images"));
    const dbImages = new Set((await Image.find().select("_id")).map(val => val._id.toString()) as string[]);

    // toDelete is symmetric difference of both sets
    const docsToDelete: string[] = [];
    dbImages.forEach(img => {
        if (!fileImages.has(img)) {
            docsToDelete.push(img);
        }
    });
    let docsDeleted = (await Image.deleteMany({ _id: docsToDelete })).deletedCount;

    // get to create (those in fileImages but not in dbImages)
    let filesDeleted = 0;
    fileImages.forEach(img => {
        if (!dbImages.has(img)) {
            rmSync(`images/${img}`);
            filesDeleted++;
        }
    });

    res.send({
        error: false,
        message: `Successfully deleted ${docsDeleted} documents(s) and ${filesDeleted} file(s)`
    });
};