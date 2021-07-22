const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }

    try {
        const token = req.headers.authorization.split(' ')[1];

        if(!token) {
            return res.status(401).json({message: "Отказано в доступе, нет токена"})
        }

        const decoded = jwt.verify(token, config.get('jwtAccessSecret'));
        
        req.user = decoded;
        next();

    } catch (e) {
        return res.status(401).json({message: "Отказано в доступе, произошла ошибка"})
    }
}