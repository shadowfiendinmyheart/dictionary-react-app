const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const auth = require('../middleware/auth.middleware');
const getImagePage = require('../services/image');

const router = Router();

// images/list?search=...&page=...
// Получить список картинок
router.get('/list', 
    [
        check('search', 'Введите запрос').notEmpty().isString(),
        auth
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Вы допустили ошибку . . .'
                })
            }
            const search = req.query.search;
            const page = req.query.page;

            const imageList = JSON.parse(await getImagePage(page, search));
            
            const answer = imageList.hits.map(img => img.webformatURL);
            const numberOfPage = Math.ceil(imageList.totalHits / 20);
            res.set('number-of-page', numberOfPage);
            return res.status(200).json({ message: answer });
        } catch (e) {
            return res.status(400).json({ message: 'Произошла обшибка на сервере' });
        }
    }
)

module.exports = router;