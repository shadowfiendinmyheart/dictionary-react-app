const fetch = require('node-fetch');
const config = require('../config/default.json')

const getImagePage = async (numberOfPage, search) => {
    const response = await fetch(`https://pixabay.com/api/?key=${config.pixabayApi}&q=${encodeURIComponent(search)}&page=${numberOfPage}`, {
        method: 'GET',
    });
    const answer = await response.text();
    
    return answer;
}

module.exports = getImagePage;