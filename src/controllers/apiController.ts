import { Phrase } from './../models/Phrase';
import { Request, Response } from 'express';
import sharp from 'sharp';
import { unlink } from 'fs/promises';

export const ping = (req: Request, res: Response) => {
    res.json({ pong: true });
};

export const random = (req: Request, res: Response) => {
    let numberRandom: number = Math.floor(Math.random() * 10);

    res.json({ number: numberRandom });
};

export const name = (req: Request, res: Response) => {
    let nome: string = req.params.name;
    res.json({ retorno: `Seu nome é ${nome}` });
};

export const createPhrase = async (req: Request, res: Response) => {
    let author: string = req.body.author;
    let text: string = req.body.text;
    //ou
    // let {author, text} = req.body;

    let newPhrase = await Phrase.create({ author, text });

    res.status(201);
    return res.json({ id: newPhrase.id, author, text });
};

export const getPhrases = async (req: Request, res: Response) => {
    let list = await Phrase.findAll();
    res.json({ list });
};

export const getPhrase = async (req: Request, res: Response) => {
    let { id } = req.params;
    let phrase = await Phrase.findByPk(id);

    let status = phrase ? 200 : 404;
    let response = phrase ? phrase : { error: 'Phrase not found' };

    res.status(status);
    res.json({ response });
};

export const uploadFile = async (request: Request, response: Response) => {
    if (request.file) {
        const filename = `${request.file.filename}.jpg`

        await sharp(request.file.path)
                .resize(200)
                .toFormat('jpeg')
                .toFile(`./public/media/${filename}`);

        await unlink(request.file.path);

        response.json({image: `${filename}`});
    } else {
        response.status(400);
        response.json({ error: 'Arquivo inválido!' });
    }
};
