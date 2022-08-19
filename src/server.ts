import express, { ErrorRequestHandler, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { MulterError } from 'multer';
import cors from 'cors';

dotenv.config();

const server = express();

// Por padrão os navegadores bloquearão o acesso a APIs que não estão em seu domínio (Exemplo: site resttesttest.com tentando acessar uma API para teste em localhost vai dar erro. Quando é localhost para localhost ou mesmo dominínio para mesmo domínio, funciona). Para liberar acessa da minha API a outro domínio, é necessário adicionar o cors.
server.use(
    cors({
        origin: '*', //Todos os domínios podem acessar a API
        // origin: 'https://uol.com.br', //Somente o site da uol pode acessar a API
        // methods: ['POST', 'GET']  //Também é possível liberar um método específico, por padrão todos são liberados
    })
);

server.use(express.static(path.join(__dirname, '../public')));
server.use(express.urlencoded({ extended: true }));

server.use('/api', apiRoutes);

server.use((req: Request, res: Response) => {
    res.status(404);
    res.json({ error: 'Endpoint não encontrado.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(400);

    if (err instanceof MulterError) {
        res.json({ error: err.code });
    } else {
        console.log(err);
        res.json({ error: 'Falha inesperada.' });
    }
};

server.use(errorHandler);

server.listen(process.env.PORT);
