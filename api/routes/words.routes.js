const {Router} = require('express');
const {check, validationResult} = require('express-validator');

const Dictionary = require('../models/Dictionary');
const User = require('../models/User');

const auth = require('../middleware/auth.middleware');
const getTranslatedWord = require('../services/translate');

const router = Router();
const language = "eng";
// words/translate?word=
// Получить перевод слова
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

      return res.status(200).json({message: translatedWord});
    } catch (e) {
      return res.status(400).json({message: 'Произошла обшибка на сервере'})
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

      const findDictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
      let dictionary;
      if (findDictionary) {
        dictionary = findDictionary;
      } else {
        dictionary = new Dictionary();
      }
      console.log(dictionary);

      //Существует ли такое слово в словаре вообще
      const findWordId = dictionary.words.findIndex(word => word.word === reqWord);
      console.log(findWordId);
      let word;
      if (findWordId > -1) {
        word = dictionary.words[findWordId];
      } else {
        const wordId = dictionary.words.push({
          word: reqWord,
          translations: [],
          imageURL: reqImageURL,
        }) - 1;
        word = dictionary.words[wordId];
      }

      //Существует ли такой перевод слова
      const findTranslation = word.translations.find(word => word === reqTranslation);

      if (!findTranslation) {
        word.translations.push(reqTranslation);
      }

      await dictionary.save();
      return res.status(201).json({message: 'Словарь обновлен', word: word});
    } catch (e) {
      return res.status(400).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

// Получение слова из списка слов пользователя
router.get('/getEngWord',
  [
    check('reqWord', 'Введите слово').notEmpty().isString(),
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

      const reqWord = req.query.reqWord;
      const reqUserId = req.user.userId;

      //Поиск словаря
      const dictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
      if (!dictionary) {
        return res.status(204).send();
      }

      //Поиск англ.слова
      const findWordId = dictionary.words.findIndex(word => word.word === reqWord);
      if (findWordId === -1) {
        return res.status(204).send();
      }

      //Вовзвращение объекта: слово, перевод, картинка, статус, дата
      return res.status(200).json({message: dictionary.words[findWordId]});
    } catch (e) {
      return res.status(400).json({message: 'Произошла обшибка на сервере'})
    }
  }
)


module.exports = router;