import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import GameTranslation from './components/GameTranslation';
import ScoreInfo from './components/ScoreInfo';
import user from '../../store/user';
import { useHttp } from '../../hooks/http.hook';

import styles from './GameTranslationPage.module.scss';

export interface ICards {
    word: string,
    translate: string,
    img: string,
    counter: number,
    isRightAnswer?: boolean,
}

const GameTranslationPage = (): React.ReactElement => {
    const [isGame, setGame] = useState<boolean>(true);
    const [cards, setCards] = useState<ICards[]>([]);

    const { request, loading } = useHttp();

    const fillCards = () => {
        request(
            `words/getRandomWords?counterFilter=10&count=10`,
            'GET',
            null,
            {Authorization: `Bearer ${user.token}`}
        ).then(res => {
            const cardsResponse: ICards[] = res.message.map((r: any) => {
                return ({
                    word: r.word,
                    translate: r.translations[0],
                    img: r.imageURL,
                    counter: r.counter,
                    isRightAnswer: false,
                })
            })
            
            if (cardsResponse) setCards(cardsResponse);
        });
    }

    useEffect(() => {
        fillCards();
    }, []);

    const gameAgainHandler = () => {
        fillCards();
        setGame(true);
    }
    
    const rightAnswerHandler = (cardNumber: number) => {
        const updateCards: ICards[] = [...cards];
        updateCards[cardNumber].isRightAnswer = true;
        setCards(updateCards);
    }

    return (
        <>
            {isGame ?  
                <GameTranslation 
                    cards={cards} 
                    lengthWords={cards.length} 
                    onFinish={() => setGame(false)}
                    onRightAnswer={rightAnswerHandler}
                    loading={loading}
                /> : <ScoreInfo cards={cards} onGameAgain={gameAgainHandler}/>
            }
        </>
    )
}

export default observer(GameTranslationPage);