const fetch = require('node-fetch');
const config = require('../config/default.json')

const getAuthKey = async () => {
  const response = await fetch('https://developers.lingvolive.com/api/v1.1/authenticate', {
    method: 'POST',
    headers: {
        'Authorization': `Basic ${config.abbyyApi}`,
      },
    }
  )
  const answer = await response.text();
  return answer;
}

const getTranslatedWord = async (word) => {
  const key = await getAuthKey();
  const response = await fetch(`https://developers.lingvolive.com/api/v1/Minicard?text=${word}&srcLang=1033&dstLang=1049`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${key}`,
      },
    });
  
  const answer = await response.json();
  return answer.Translation.Translation;
}

module.exports = getTranslatedWord;