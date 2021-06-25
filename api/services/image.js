const fetch = require('node-fetch');
const config = require('../config/default.json')

const getImagePage = async (numberOfPage, search) => {
    const response = await fetch(`https://api.unsplash.com/search/photos?page=${numberOfPage}&query=${search}`, {
        method: 'GET',
        headers: {
            'Authorization': `Client-ID ${config.unsplashAccessKey}`
        }
    });
    const answer = await response.text();
    return answer;
}

module.exports = getImagePage;