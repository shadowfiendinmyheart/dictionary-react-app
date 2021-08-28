const {Router} = require('express');
const {check, validationResult} = require('express-validator');
const mongoose = require('mongoose');
const { wordListLimit, knownWordsCounter, randomWordsDateDifference} = require('../constants/words');

const Dictionary = require('../models/Dictionary');
const User = require('../models/User');

const auth = require('../middleware/auth.middleware');
const getTranslatedWords = require('../services/translate');
const {booleanParser} = require("config/parser");

const router = Router();
const language = "eng";//Захардкодил

// words/translate?word=
// Получить перевод слова
router.get('/translate', 
  [
    check('word', 'Введите слово').notEmpty().isString().toLowerCase(),
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
      const translatedWords = await getTranslatedWords(word);
      const answer = translatedWords.join(', ');

      return res.status(200).json({ message: answer });
    } catch (e) {
      return res.status(400).json({message: 'Произошла обшибка на сервере'})
    }
  }
)

router.post('/createDictionary', auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Вы допустили ошибку . . .'
        })
      }

      const reqUserId = req.user.userId;

      const findDictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
      if (findDictionary) {
        return res.status(400).json({message: "Словарь с таким языком уже существует"});
      }
      const dictionary = new Dictionary({language: language, ownerId: reqUserId});
      
      const findUser = await User.findOne({"_id": reqUserId});
      findUser.dictionaries.push(dictionary);

      await findUser.save();
      await dictionary.save();
      return res.status(201).json({message: 'Словарь создан'});
    } catch (e) {
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

// Сохранение слова в словарь
router.post('/saveTranslation',
  [
    check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
    check('reqTranslation', 'Введите перевод').notEmpty().isString().toLowerCase(),
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



// Сохранение перевода слова
router.post('/addTranslation',
  [
    check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
    check('reqTranslation', 'Введите перевод').notEmpty().isString().toLowerCase(),
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

      const {reqWord, reqTranslation} = req.body;
      const reqUserId = req.user.userId;

      const dictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
      if (!dictionary) {
        return res.status(400).json({message: "Отсутствует словарь"});
      }

      //Существует ли такое слово в словаре вообще
      const findWordId = dictionary.words.findIndex(word => word.word === reqWord);

      if (findWordId === -1) {
        return res.status(400).json({message: "Отсутствует слово"});
      }
      const word = dictionary.words[findWordId];

      //Существует ли такой перевод слова
      const findTranslation = word.translations.find(word => word === reqTranslation);
      if (!findTranslation) {
        word.translations.push(reqTranslation);
      }

      await dictionary.save();
      return res.status(201).json({message: 'Перевод добавлен', word: word});
    } catch (e) {
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

// Сохранение перевода слова
router.post('/editTranslation',
    [
      check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
      check('reqTranslations', 'Введите переводы').notEmpty().isString().toLowerCase(),
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

        const {reqWord, reqTranslations} = req.body;
        const reqUserId = req.user.userId;

        const dictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
        if (!dictionary) {
          return res.status(400).json({message: "Отсутствует словарь"});
        }

        //Существует ли такое слово в словаре вообще
        const findWordId = dictionary.words.findIndex(word => word.word === reqWord);

        if (findWordId === -1) {
          return res.status(400).json({message: "Отсутствует слово"});
        }
        const word = dictionary.words[findWordId];

        word.translations = [];
        const translationsArr = reqTranslations.split(", ");
        Array.prototype.push.apply(word.translations, translationsArr)

        await dictionary.save();
        return res.status(201).json({message: 'Перевод изменен', word: word});
      } catch (e) {
        return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
      }
    }
)

//Добавление слова в словарь
router.post('/addWord',
  [
    check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
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

      const {reqWord, reqImageURL} = req.body;
      const reqUserId = req.user.userId;

      const dictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
      if (!dictionary) {
        return res.status(400).json({message: "Отсутствует словарь"});
      }

      //Существует ли такое слово в словаре вообще
      const findWordId = dictionary.words.findIndex(word => word.word === reqWord);
      if (findWordId > -1) {
        return res.status(400).json({message: "Слово уже существует"});
      }
      //Пушим слово
      const wordId = dictionary.words.push({
        word: reqWord,
        translations: [],
        imageURL: reqImageURL,
      }) - 1;
      const word = dictionary.words[wordId];

      await dictionary.save();
      return res.status(201).json({message: 'Слово добавлено', word: word});
    } catch (e) {
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

//Изменение картинки
router.post('/setImage',
    [
      check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
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

        const {reqWord, reqImageURL} = req.body;
        const reqUserId = req.user.userId;

        const dictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});
        if (!dictionary) {
          return res.status(400).json({message: "Отсутствует словарь"});
        }

        //Существует ли такое слово в словаре вообще
        const findWordId = dictionary.words.findIndex(word => word.word === reqWord);
        if (findWordId === -1) {
          return res.status(400).json({message: "Такого слова нет"});
        }

        const word = dictionary.words[findWordId];
        word.imageURL = reqImageURL;

        await dictionary.save();
        return res.status(201).json({message: 'Картинка изменена', word: word});
      } catch (e) {
        return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
      }
    }
)

// Получение слова из списка слов пользователя
router.get('/getEngWord',
  [
    check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
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
      const dictionaryAggregation = await Dictionary.aggregate([
        {
          $match: {
            "language": language,
            "ownerId": mongoose.Types.ObjectId(reqUserId)
          }
        },
        {
          $project: {
            "words":{
              $filter: {
                input:"$words",
                as:"word",
                cond:{$eq: ["$$word.word", reqWord]}
              }
            }
          }
        }
      ])

      if (!dictionaryAggregation[0]) {
        return res.status(400).json({message: "Словарь отсутствует"});
      }

      if (dictionaryAggregation[0].words.length === 0) {
        return res.status(200).json({message: []});
      }

      //Вовзвращение объекта: слово, перевод, картинка, статус, дата
      return res.status(200).json({message: dictionaryAggregation[0].words[0]});
    } catch (e) {
      console.log('route /getEngWord', e);
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

//Сеттер счетчика угадываний слова для игры
router.post('/setCounter',
  [
    check('reqWord', 'Введите слово').notEmpty().isString().toLowerCase(),
    check('reqCount','Введите число').notEmpty().isNumeric(),
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

      const {reqWord, reqCount} = req.body;
      const reqUserId = req.user.userId;

      //Поиск словаря
      const dictionary = await Dictionary.findOne({"language": language, "ownerId": reqUserId});

      if (!dictionary) {
        return res.status(400).json({message: "Словарь отсутствует"});
      }

      //Поиск англ.слова
      const findWordId = dictionary.words.findIndex(word => word.word === reqWord);
      if (findWordId === -1) {
        return res.status(400).json({message: "Слово отсутствует"});
      }

      dictionary.words[findWordId].counter = reqCount;

      await dictionary.save();
      return res.status(201).json({message: 'Счетчик обновлен'});
    } catch (e) {
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

//Получение списка слов постранично (5 на одну стр)
router.get('/getWordsList',
  [
    check('page', 'Введите страницу').notEmpty().isNumeric(),
    check('mode', 'Введите режим выдачи списка').notEmpty().isNumeric(),
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

      const page = req.query.page;
      const mode = req.query.mode;
      const reqUserId = req.user.userId;

      let condition;
      switch (mode) {
        case "0":
          condition = {$gt: -1}
          break;
        case "1":
          condition = {$lt: knownWordsCounter}
          break;
        case "2":
          condition = {$gt: knownWordsCounter}
          break;
      }

      const countAggregation = await Dictionary.aggregate([
        {
          $match: {
            "language": language,
            "ownerId": mongoose.Types.ObjectId(reqUserId)
          }
        },
        {
          $project: {
            "wordsCount": {$size: "$words"}
          }
        }
      ]);

      const dictionaryAggregation = await Dictionary.aggregate([
        {
          $match: {
            "language": language,
            "ownerId": mongoose.Types.ObjectId(reqUserId)
          },
        },
        {
          $unwind : {
            path: "$words"
          }
        },
        {
          $match: {
            "words.counter": condition
          }
        },
        {
          $skip: (page - 1) * wordListLimit
        },
        {
          $limit: wordListLimit
        }
      ]);

      if (!dictionaryAggregation) {
        return res.status(400).json({message: "Словарь отсутствует"});
      }

      let wordsArr = [];
      dictionaryAggregation.forEach((word) => {
        wordsArr.push(word.words);
      })

      return res.status(200).json({
        wordsArr: wordsArr,
        pagesTotal: Math.ceil(countAggregation[0].wordsCount / wordListLimit)
      });
    } catch (e) {
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

router.get('/getRandomWords',
  [
    check('counterFilter', 'Введите фильтр показов').notEmpty().isNumeric(),
    check('count', 'Введите количество нужных слов').notEmpty().isNumeric(),
    check('checkDate', 'Укажите флажок фильтра по дате').notEmpty().isBoolean(),
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

      const counterFilter = parseInt(req.query.counterFilter);
      const count = parseInt(req.query.count);
      const checkDate = (req.query.checkDate.toLowerCase() === "true");
      const reqUserId = req.user.userId;

      let pipeline = [
        {
          $match: {
            "language": language,
            "ownerId": mongoose.Types.ObjectId(reqUserId)
          }
        },
        {
          $unwind : {
            path: "$words"
          }
        },
        {
          $match: {
            "words.counter": {
              $lt: counterFilter
            }
          }
        }
      ]

      if (checkDate) {
        let lastDate = new Date(Date.now());
        lastDate.setDate(lastDate.getDate() - randomWordsDateDifference);
        const dateMatch = {
          '$match' : {'words.date': {'$lte': lastDate}}
        }
        pipeline.push(dateMatch);
      }

      pipeline.push({$sample: {size: count}});
      pipeline.push({$project: {"word": "$words"}});



      const dictionaryAggregation = await Dictionary.aggregate(pipeline)

      const words = dictionaryAggregation.map(w => {return {...w.word}});

      return res.status(200).json({message: words});
    } catch (e) {
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)

router.get('/count', auth,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'Вы допустили ошибку...'
        })
      }
      const reqUserId = req.user.userId;

      const dictionaries = await Dictionary.find({ "ownerId": reqUserId });

      // TODO: по возмможности перенести эту логику в запрос к бд
      const allWords = dictionaries.map(d => d.words.map(w => w)).flat();
      const knownWords = allWords.filter(w => w.counter > knownWordsCounter);

      return res.status(201).json({message: {allWords: allWords.length, knownWords: knownWords.length }});
    } catch (e) {
      return res.status(500).json({message: 'Произошла ошибка на сервере', error: e})
    }
  }
)


module.exports = router;