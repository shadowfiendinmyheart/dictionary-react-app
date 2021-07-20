import React, { useState } from 'react';
import InputForm from '../../../../components/InputForm';
import Button from '../../../../components/Button';
import useInput from '../../../../hooks/input.hook';

import styles from './GameTranslation.module.scss';

type GameTranslationProps = {
    mock: any;
    lengthWords: number;
}

const GameTranslation = (props: GameTranslationProps): React.ReactElement => {
    const { mock, lengthWords } = props;
    
    const [counter, setCounter] = useState<number>(0);
    const translate = useInput('');
    
    const compareWords = (firstWord: string, secondWord: string) => {
        firstWord = firstWord.trim().toLowerCase();
        secondWord = secondWord.trim().toLowerCase();
    
        if (firstWord !== secondWord) {
            return false;
        }
    
        return true;
    }

    const buttonHandler = (ev: React.SyntheticEvent) => {
        ev.preventDefault();
        ev.stopPropagation();
        
        const pass = compareWords(translate.value, mock[counter].translate);
        
        if (pass) {
            console.log('gratz, u r right');
            translate.setValue('');
            setCounter((prev) => prev + 1);
        } else {
            console.log('ты балбес, пробуй ещё');
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.window}>
                <h2>{`${counter} / ${lengthWords}`}</h2>
                <img className={styles.img} src={mock[counter].img} alt="card" />
                <h2>{mock[counter].word}</h2>
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

export default GameTranslation;