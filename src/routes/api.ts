import { Router } from 'express';
import * as ApiController from '../controllers/apiController';
import multer from 'multer';

// Salvar na memória física do servidor
const storageConfig = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './tmp');
    },
    filename: (req, file, callback) => {
        callback(null, `${file.fieldname+Date.now()}.jpg`)
    }
})

// Salvar na memória RAM do servidor
const storageConfig2 = multer.memoryStorage();

const upload = multer({
    // storage: storageConfig,
    dest: './tmp',
    fileFilter: (req, file, callback) => {
        const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png']; //Aceitar apenas jpg, jpeg e png

        if(allowed.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    limits: { fieldNameSize: 100, fileSize: 2000000 } //Aceita somente arquivos com até 100 caracteres no nome e com um tamanho de até 2 MB
});

const router = Router();

router.get('/ping', ApiController.ping);
router.get('/random', ApiController.random);
router.get('/name/:name', ApiController.name);

router.post('/phrase', ApiController.createPhrase);
router.get('/phrases', ApiController.getPhrases);
router.get('/phrase/:id', ApiController.getPhrase);

router.post('/upload', upload.single('avatar'), ApiController.uploadFile);

export default router;
