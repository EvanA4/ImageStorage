import { Request, Response } from "express";


export async function getHelloWorld(_: Request, res: Response) {
    res.send({
        message: "Hello world!"
    });
};