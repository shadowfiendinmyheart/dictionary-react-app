import React from 'react';
import cn from 'clsx';
import LinkAsButton from '../../../../components/LinkAsButton';
import Button from '../../../../components/Button';

import styles from './ScoreInfo.module.scss';
import { ROUTES } from '../../../../constants';

const mockWords = [
    {
        word: 'cat',
        translate: 'кот',
        isAnswer: true
    },
    {
        word: 'dog',
        translate: 'пёс',
        isAnswer: true
    },
    {
        word: 'bird',
        translate: 'птица',
        isAnswer: false
    },
    {
        word: 'mouse',
        translate: 'мышь',
        isAnswer: true
    },
    {
        word: 'dolphin',
        translate: 'дельфин',
        isAnswer: true
    },
]

const ScoreInfo = (): React.ReactElement => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.window}>
                <div className={styles.leftSide}>
                    {mockWords.map(mock => {
                        return (
                            <div className={cn(mock.isAnswer ? styles.true : styles.false)}>
                                <div>
                                    {mock.word}
                                </div>
                                <div>
                                    {mock.translate}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.rightSide}>
                    <LinkAsButton text={'Назад'} to={ROUTES.HOME_PAGE} />
                    <Button onClick={() => console.log('mock')} text={'Играть снова'}  />
                    <div>Вы угадали: <br/> 4 из 5 слов</div>
                </div>
            </div>
        </div>
    )
}

export default ScoreInfo;