const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const Dictionary = require('../../models/Dictionary');
const User = require('../../models/User');

const auth = require('../../middleware/auth.middleware');
const getTranslatedWord = require('../../services/translate');

const router = Router();
const language = "eng";//Захардкодил
const wordListLimit = 5;//Захардкодил

function saveTranslation([
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

      const dictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
      if (!dictionary) {
        return res.status(400).json({message: "Отсутствует словарь"});
      }

      //Существует ли такое слово в словаре вообще
      const findWordId = dictionary.words.findIndex(word => word.word === reqWord);

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
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

module.exports = router;