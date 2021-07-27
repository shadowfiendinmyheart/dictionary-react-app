const jwt = require('jsonwebtoken');
const Token = require('../models/Token');
const config = require('config');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, config.get('jwtAccessSecret'), {expiresIn: '1h'});
        const refreshToken = jwt.sign(payload, config.get('jwtRefreshSecret'), {expiresIn: '30d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, config.get('jwtAccessSecret'));
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, config.get('jwtRefreshSecret'));
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }
        const token = await Token.create({user: userId, refreshToken});
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await Token.deleteOne({refreshToken});
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({refreshToken});
        return tokenData;
    }
}

module.exports = new TokenService();