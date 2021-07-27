import React, { useState } from 'react';
import GameTranslation from './components/GameTranslation';
import ScoreInfo from './components/ScoreInfo';

import styles from './GameTranslationPage.module.scss';

const mock = [
    {
        word: 'cat',
        translate: 'кот',
        img: 'https://storage.vsemayki.ru/images/0/1/1272/1272472/previews/people_1_pants_fullprint_front_white_500.jpg'
    },
    {
        word: 'dog',
        translate: 'собака',
        img: 'https://hvost.news/upload/resize_cache/iblock/235/750_400_1/10_sposobov_razveselit_sobaku.jpg'
    },
    {
        word: 'phone',
        translate: 'телефон',
        img: 'https://icdn.lenta.ru/images/2020/02/10/11/20200210113855000/pwa_vertical_1024_8f2ba588f2232518c98929c7bd4a4ca7.jpg'
    },
    {
        word: 'board',
        translate: 'доска',
        img: 'https://www.castorama.ru/media/catalog/product/cache/image/1800x/040ec09b1e35df139433887a97daa66f/0/b/0ba0e0_564970_1.jpg'
    },
    {
        word: 'mouse',
        translate: 'мышь',
        img: 'https://www.passionforum.ru/upload/125/u12554/76/4e/krisa-idei-4.jpg'
    },
]



const GameTranslationPage = (): React.ReactElement => {
    const [isGame, setGame] = useState(false);

    return (
        <>
            {isGame ? ( 
                <GameTranslation mock={mock} lengthWords={mock.length} />) 
                : <ScoreInfo />
            }
        </>
    )
}

export default GameTranslationPage;