const Reverso = require('reverso-api');

const reverso = new Reverso();

const getTranslatedWords = async(word) => {
    const request = await reverso.getContext(word, 'English', 'Russian');
    const answer = request.translation.slice(0, 3);

    return answer;
}

module.exports = getTranslatedWords;