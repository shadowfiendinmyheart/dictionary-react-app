import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import GameTranslation from './components/GameTranslation';
import ScoreInfo from './components/ScoreInfo';
import user from '../../store/user';
import { useHttp } from '../../hooks/http.hook';

import styles from './GameTranslationPage.module.scss';

export interface ICard {
    word: string,
    translate: string,
    img: string,
    counter: number,
    isRightAnswer: boolean,
    userAnswer?: string,
}

const GameTranslationPage = (): React.ReactElement => {
    const [isGame, setGame] = useState<boolean>(true);
    const [cards, setCards] = useState<ICard[]>([]);

    const { request, loading } = useHttp();

    const fillCards = () => {
        request(
            `words/getRandomWords?counterFilter=10&count=10`,
            'GET',
            null,
            {Authorization: `Bearer ${user.token}`}
        ).then((res: any) => {
            const cardsResponse: ICard[] = res.message.map((r: any): ICard => {
                return ({
                    word: r.word,
                    translate: r.translations[0],
                    img: r.imageURL,
                    counter: r.counter,
                    isRightAnswer: false,
                    userAnswer: undefined,
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
        const updateCards: ICard[] = [...cards];
        updateCards[cardNumber].isRightAnswer = true;
        setCards(updateCards);
    }

    const falseAnswerHandler = (cardNumber: number, userAnswer: string) => {
        const updateCards: ICard[] = [...cards];
        updateCards[cardNumber].userAnswer = userAnswer;
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
                    onFalseAnswer={falseAnswerHandler}
                    loadingPage={loading}
                /> : <ScoreInfo cards={cards} onGameAgain={gameAgainHandler}/>
            }
        </>
    )
}

export default observer(GameTranslationPage);