const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const Dictionary = require('../models/Dictionary');
const User = require('../models/User');

const auth = require('../middleware/auth.middleware');
const getTranslatedWord = require('../services/translate');

const router = Router();
const language = "eng";
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

// Сохранение слова в словарь
router.post('/saveTranslation',
    [
      check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
      check('reqTranslation', 'Введите перевод').notEmpty().isString().toLowerCase(),
      check('reqImageURL', 'Введите URL картинки').notEmpty().isString().toLowerCase(),
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

        const findDictionary = await Dictionary.findOne({"language":language, "ownerId": reqUserId});
        let dictionary;
        if (findDictionary) {
            dictionary = findDictionary;
        } else {
            dictionary = new Dictionary();
        }
        console.log(dictionary);

        //Существует ли такое слово в словаре вообще
        const findWord = dictionary.words.find(word => word.word === reqWord);
        let word;
        if(findWord) {
            word = findWord;
        } else {
            word = {
                word: reqWord,
                translations: [],
                imageURL: reqImageURL,
                status: "watched"
            }
            dictionary.words.push(word);
        }

        //Существует ли такой перевод слова
        const findTranslation = word.translations.find(word => word === reqTranslation);
        console.log(word.translations);
        if(!findTranslation) {
            word.translations.push(reqTranslation);
        }

        return res.status(201).json({ dictionary: dictionary, word: word});
      } catch (e) {
        return res.status(400).json({ message: 'Произошла ошибка на сервере', error: e})
      }
    }
)

// Получение слова из списка слов пользователя
router.get('/getEngWord',
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

        //Поиск слова в коллекции англ.слов
        const findEngWord = await EngWord.findOne({word: word});
        if(!findEngWord) {
          return res.status(204);
        }

        //Поиск слова в массиве слов пользователя
        const findUserWord = user.words.find(userWord => {return userWord.word.toString() === findEngWord._id.toString();})
        if (!findUserWord) {
          return res.status(204);
        }

        //Поиск переводов в коллекции рус.слов
        const findTranslationsArr = await RusWord.find({_id: { $in: findEngWord.translations}},'word -_id');
        let translationsArr = findTranslationsArr.map(item => item.word);

        //Вовзвращение объекта: слово, перевод, картинка, статус
        return res.status(200).json({ message: {
            word: findEngWord.word,
            translations: translationsArr,
            imageURL: findUserWord.imageURL,
            status: findUserWord.status
          }});

      } catch (e) {
        return res.status(400).json({ message: 'Произошла обшибка на сервере' })
      }
    }
)



module.exports = router;