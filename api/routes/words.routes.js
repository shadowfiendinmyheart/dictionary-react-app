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
      check('reqWord', 'Введите слово').notEmpty().isString(),
      check('reqTranslation', 'Введите перевод').notEmpty().isString(),
      auth
    ],
    async (req, res) => {
      try {
        console.log('Body : ', req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            errors: errors.array(),
            message: 'Вы допустили ошибку . . .'
          })
        }

        const {reqWord, reqTranslation} = req.body;
        const reqUserId = req.user.userId;

        const findWord = await EngWord.findOne({word: reqWord});
        let word;
        if(findWord) {
          word = findWord
        } else {
          word = new EngWord({word: reqWord})
        }

        const findTranslation = await RusWord.findOne({word: reqTranslation});
        let translation;
        if(findTranslation) {
          translation = findTranslation
        } else {
          translation = new RusWord({word: reqTranslation})
          await translation.save();
        }
        word.translations.push(translation._id);
        await word.save();

        const user = await User.findOne({_id: reqUserId});
        user.words.push({word: word._id});
        await user.save();

        return res.status(201).json({ message: 'Слово добавлено в словарь'});
      } catch (e) {
        return res.status(400).json({ message: 'Произошла ошибка на сервере', error: e})
      }
    }
)

router.get



module.exports = router;