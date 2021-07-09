const { Router } = require('express');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

const router = Router();

// user/info
// Получить информацию об авторизованном пользователе
router.get('/info', 
    [
        auth
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('errors', errors);
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Вы допустили ошибку . . .'
                })
            }
            
            const user = await User.findOne({_id: req.user.userId});

            return res.status(200).json({ message: user});
        } catch (e) {
            return res.status(400).json({ message: 'Произошла обшибка на сервере' });
        }
    }
)

module.exports = router;