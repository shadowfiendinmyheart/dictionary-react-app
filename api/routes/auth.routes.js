const {Router} = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User')
const router = Router();

router.post('/registration', 
  [
    check('regNickname', 'Некорректный никнейм').notEmpty().isString(),
    check('regLogin', 'Некорректный логин').notEmpty().isString(),
    check('regPassword', 'Некорректный пароль').isLength( { min: 6}),
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Введены некорректные данные'
      })
    }

    const {regNickname, regLogin, regPassword, regPasswordRepeat} = req.body;

    // const findNickname = await User.findOne({ nickname: regNickname });
    const findLogin = await User.findOne({ login: regLogin });

    // if (findNickname) {
    //   return res.status(400).json({ message: 'Пользователь с таким никнеймом уже существует' });
    // }

    if (findLogin) {
      return res.status(400).json({ message: 'Пользователь с таким логином уже существует' });
    }

    if (regPassword === regPasswordRepeat) {
      const hashedPassword = await bcrypt.hash(regPassword, 12);
      const user = new User({
        nickname: regNickname,
        login: regLogin,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: 'Пользователь создан' });
    } else {
      return res.status(400).json({ message: 'Введённые пароли не совпадают' })
    }


  } catch(e) {
    res.status(500).json({ message: 'u broke the site . . .'})
  }
})

router.post('/login', 
  [
    check('authLogin', 'Некорректный логин').notEmpty(),
    check('authPassword', 'Некорректный пароль').exists().bail().isLength( { min: 6}),
  ],  
  async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Введены некорректные данные'
      })
    }

    const {authLogin, authPassword} = req.body;
    const user = await User.findOne({ login: authLogin })

    if (!user) {
      return res.status(400).json({ message: 'Такого пользователя не существует'})
    }

    const isMatch = await bcrypt.compare(authPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h'}
    )

    res.json({ token, userId: user.id })

  } catch(e) {
    res.status(500).json({ message: 'u broke the site . . .'})
  }
})

module.exports = router;