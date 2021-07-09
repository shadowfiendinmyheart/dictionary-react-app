const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const EngWord = require('../models/EngWord');
const RusWord = require('../models/RusWord');
const User = require('../models/User')//А я хз че делаю ляляля

const auth = require('../middleware/auth.middleware');
const getTranslatedWord = require('../services/abbyy');

const router = Router();

// words/translate?word=
// Получить перевод слова с Abbyy
router.get('/translate', 
  [
    check('word', 'Введите слово').notEmpty().isString(),
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
      check('reqImageURL', 'Введите URL картинки').notEmpty().isString(),
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

        const {reqWord, reqTranslation, reqImageURL} = req.body;
        const reqUserId = req.user.userId;

        //Поиск слова в коллекции английских слов
        const findWord = await EngWord.findOne({word: reqWord});
        let word;
        if(findWord) {
          word = findWord
        } else {
          word = new EngWord({word: reqWord})
        }

        //Поиск слова в коллекции русских слов
        const findRusWord = await RusWord.findOne({word: reqTranslation});
        let rusWord;
        if(findRusWord) {
          rusWord = findRusWord
        } else {
          rusWord = new RusWord({word: reqTranslation})
          await rusWord.save();
        }

        //Поиск русского слова в списке переводов английского слова
        const findTranslation = word.translations.find(id => rusWord._id.toString() === id.toString());
        if (!findTranslation) {
          word.translations.push(rusWord._id);
          await word.save();
        }

        //Поиск английского слова в списке слов пользователя
        const user = await User.findOne({_id: reqUserId});
        const findUserWord = user.words.find(userWord => userWord.word.toString() === word._id.toString())
        if (!findUserWord) {
          user.words.push({word: word._id, imageURL: reqImageURL});
          await user.save();
        }


        return res.status(201).json({ message: 'Слово добавлено в словарь'});
      } catch (e) {
        return res.status(400).json({ message: 'Произошла ошибка на сервере', error: e})
      }
    }
)

router.get('/getWord',
    [
      check('word', 'Введите слово').notEmpty().isString(),
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

        const word = req.query.word;
        const reqUserId = req.user.userId;
        const user = await User.findOne({_id: reqUserId});

        return res.status(200).json({ message: "Boobs"});
      } catch (e) {
        return res.status(400).json({ message: 'Произошла обшибка на сервере' })
      }
    }
)



module.exports = router;