const translate = require('@vitalets/google-translate-api');

const getTranslatedWord = (word) => {
    const answer = translate(word, {from: 'en', to: 'ru'}).then(res => {
        return res.text;
    }).catch(err => {
        console.error(err);
        return;
    });

    return answer;
}

module.exports = getTranslatedWord;