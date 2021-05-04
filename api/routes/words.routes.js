const {Router} = require('express');
const EngWord = require('../models/EngWord');
const RusWord = require('../models/RusWord');

const User = require('../models/User')//А я хз че делаю ляляля

const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const getTranslatedWord = require('../services/abbyy');

const router = Router();

// words/translate?word=
// Получить перевод слова с Abbyy
router.get('/translate', 
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

// words/saveTranslation?token=
// Сохранение слова в словарь
router.post('/saveTranslation',
    [
      check('word', 'Введите слово').notEmpty().isString(),
      check('translation', 'Введите перевод').notEmpty().isString(),
      auth
    ],
    async (req, res) => {
      try {
        console.log('Body: ', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: 'Вы допустили ошибку . . .'
          })
        }

        const {reqWord, reqTranslation} = req.body;
        const reqUser = req.user.userId;
        const findWord = await EngWord.findOne({word: reqWord});

        if(findWord) {

        }

        const findTranslation = await RusWord.findOne({word: reqTranslation});

        await word.save();

        return res.status(201).json({ message: 'Слово добавлено в словарь'});


      } catch (e) {
        return res.status(400).json({ message: 'Произошла ошибка на сервере' })
      }
    }
)


module.exports = router;