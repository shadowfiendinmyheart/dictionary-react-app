import React, { useState } from 'react';
import { observer  } from 'mobx-react-lite';
import user from '../../../../store/user';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import useInput from '../../../../hooks/input.hook';
import { useHttp } from '../../../../hooks/http.hook';
import { ICards } from '../../GameTranslationPage';

import styles from './GameTranslation.module.scss';

type GameTranslationProps = {
    cards: ICards[];
    lengthWords: number;
    onFinish: () => void;
    onRightAnswer: (cardNumber: number) => void;
    loading: boolean;
}

const GameTranslation = (props: GameTranslationProps): React.ReactElement => {
    const { cards, lengthWords, onFinish, onRightAnswer, loading } = props;
    
    const [counter, setCounter] = useState<number>(0);
    const { request } = useHttp();
    const translate = useInput('');
    
    const compareWords = (firstWord: string, secondWord: string) => {
        firstWord = firstWord.trim().toLowerCase();
        secondWord = secondWord.trim().toLowerCase();
    
        if (firstWord !== secondWord) {
            return false;
        }
    
        return true;
    }

    const buttonHandler = async (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        ev.stopPropagation();

        if (counter === lengthWords - 1) {
            onFinish();
            return;
        }
        
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
            console.log('ты балбес');
        }
        
        translate.setValue('');
        setCounter((prev) => prev + 1);
    }

    return (
        loading ? <div className={styles.wrapper}>Loading...</div> :
        <div className={styles.wrapper}>
            <div className={styles.window}>
                <h2>{`${counter} / ${lengthWords}`}</h2>
                <img className={styles.img} src={cards[counter]?.img} alt="card" />
                <h2>{cards[counter]?.word}</h2>
                <form autoComplete='off'>
                    <InputForm 
                        name={'translate'} 
                        placeholder={'Введите перевод'} 
                        type={'text'} 
                        value={translate.value}
                        onChange={translate.onChange}
                    />
                    <Button onClick={buttonHandler} text={'Вперёд !'} />
                </form>
            </div>
        </div>
    )
}

export default observer(GameTranslation);