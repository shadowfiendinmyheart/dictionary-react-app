const {Router} = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const tokenService = require('../services/token');
const auth = require('../middleware/auth.middleware');

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

    const findLogin = await User.findOne({ login: regLogin });

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

    const tokens = tokenService.generateTokens({ userId: user.id });

    res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    await tokenService.saveToken(user._id, tokens.refreshToken);

    res.json({ accessToken: tokens.accessToken, userId: user.id });

  } catch(e) {
    console.log('ERROR:', e);
    res.status(500).json({ message: 'u broke the site . . .'})
  }
})

router.post('/logout', [auth], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Введены некорректные данные'
      })
    }

    const { refreshToken } = req.cookies;

    const token = await tokenService.removeToken(refreshToken); 

    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'logout is success', token});
  } catch (e) {
    console.log('ERROR:', e);
    res.status(500).json({ message: 'u broke the site . . .'})
  }
});

router.get('/refresh', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        errors: errors.array(),
        message: 'Введены некорректные данные'
      })
    }

    //TODO: возможно надо перенести эту логику в auth middleware (?)
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new Error('refresh token is not found');
    }
    
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw new Error('user is not auth');
    }
    
    const tokens = tokenService.generateTokens({ userId: userData.userId });
    await tokenService.saveToken(userData.userId, tokens.refreshToken);

    res.cookie('refreshToken', tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
    res.status(200).json({ message: 'refresh is success', token: tokens.accessToken });
  } catch (e) {
    console.log('ERROR:', e);
    res.status(500).json({ message: 'u broke the site . . .'});
  }
});

module.exports = router;