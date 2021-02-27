const {Router} = require('express');
const { check, validationResult } = require('express-validator');
const getTranslatedWord = require('../services/abbyy');

const router = Router();

router.get('/word', 
  [
    check('word', 'Введите слово').notEmpty().isString(),
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
      const word = req.query.word;
      const translatedWord = await getTranslatedWord(word);

      return res.status(200).json({ message: translatedWord});
    } catch (e) {
      return res.status(400).json({ message: 'Произошла обшибка на сервере' })
    }
  }
)

module.exports = router;