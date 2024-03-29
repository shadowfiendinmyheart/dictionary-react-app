import React, { useState } from 'react';
import { observer  } from 'mobx-react-lite';
import user from '../../../../store/user';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import Loader from '../../../../components/Loader';
import LoadingPage from '../../../loadingPage/LoadingPage';
import useInput from '../../../../hooks/input.hook';
import { useHttp } from '../../../../hooks/http.hook';
import { ICard } from '../../GameTranslationPage';

import styles from './GameTranslation.module.scss';

type GameTranslationProps = {
    cards: ICard[];
    lengthWords: number;
    onFinish: () => void;
    onRightAnswer: (cardNumber: number) => void;
    onFalseAnswer: (cardNumber: number, userAnswer: string) => void;
    loadingPage: boolean;
}

const GameTranslation = (props: GameTranslationProps): React.ReactElement => {
    const { cards, lengthWords, onFinish, onRightAnswer, onFalseAnswer, loadingPage } = props;
    
    const [counter, setCounter] = useState<number>(0);
    const { request, loading } = useHttp();
    const translate = useInput('');
    
    const compareWords = (userTranslate: string, translations: string) => {
        let isCheck = false;
        userTranslate = userTranslate.trim().toLowerCase();
        const translationsArr: string[] = translations.split(', ');
        
        translationsArr.forEach(translation => {
            if (translation.trim().toLowerCase() === userTranslate) {
                isCheck = true;
                return;
            }
        });

        return isCheck;
    }

    const buttonHandler = async (ev: React.SyntheticEvent) => {
        if (!translate.value) return;
        
        ev.preventDefault();
        ev.stopPropagation();

        
        const pass = compareWords(translate.value, cards[counter].translate);
        
        if (pass) {
            console.log('gratz, u r right');
            try {
                const updatedCounter = cards[counter].counter + 1;
                const data = await request(
                    `words/setCounter`, 
                    'POST', 
                    {
                        reqWord: cards[counter].word,
                        reqCount: updatedCounter,
                    },
                    {Authorization: `Bearer ${user.token}`}
                    );
                    console.log('update counter is success', data);
            } catch(e) {
                console.log('cannot update counter on a word');
            }
            onRightAnswer(counter);
        } else {
            onFalseAnswer(counter, translate.value);
            console.log('ты балбес');
        }
        translate.setValue('');

        if (counter === lengthWords - 1) {
            onFinish();
            return;
        }
        
        setCounter((prev) => prev + 1);
    }

    return (
        loadingPage ? <LoadingPage /> :
        <div className={styles.wrapper}>
            <div className={styles.window}>
                <h2>{`${counter + 1} / ${lengthWords}`}</h2>
                <img className={styles.img} src={cards[counter]?.img} alt="card" />
                <h2>{cards[counter]?.word}</h2>
                <form autoComplete='off'>
                    <InputForm
                        type={'text'} 
                        name={'translate'} 
                        placeholder={'Введите перевод'} 
                        value={translate.value}
                        onChange={translate.onChange}
                    />
                    {loading ? 
                        <div className={styles.loaderWrapper}>
                            <Loader />
                        </div> : <Button onClick={buttonHandler} text={'Вперёд !'} /> }
                </form>
            </div>
        </div>
    )
}

export default observer(GameTranslation);