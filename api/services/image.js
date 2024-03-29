const gis = require('g-i-s');

const getImages = (search) => {
    return new Promise((resolve, reject) => {
        gis(search, (err, res) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            
            const answer = res.map(r => r.url);
            resolve(answer);
        });
    })
}

module.exports = getImages;