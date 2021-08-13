import React from 'react';
import cn from 'clsx';
import { ROUTES } from '../../../../constants';
import { ICards } from '../../GameTranslationPage';
import LinkAsButton from '../../../../components/LinkAsButton';
import Button from '../../../../components/Button';

import styles from './ScoreInfo.module.scss';

type scoreInfoProps = {
    cards: ICards[];
    onGameAgain: () => void;
}

const ScoreInfo = (props: scoreInfoProps): React.ReactElement => {
    const { cards, onGameAgain } = props;
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.window}>
                <div className={styles.leftSide}>
                    {cards.map((card: ICards) => {
                        return (
                            <div className={cn(card.isRightAnswer ? styles.true : styles.false)} key={card.word}>
                                <div>
                                    {card.word}
                                </div>
                                <div>
                                    {card.translate}
                                </div>
                                {card?.userAnswer && 
                                    <div>
                                        Вы ответили: {card.userAnswer}
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className={styles.rightSide}>
                    <LinkAsButton text={'Назад'} to={ROUTES.HOME_PAGE} />
                    <Button onClick={onGameAgain} text={'Играть снова'}  />
                    <div>Вы угадали: <br/> NaN из {cards.length} слов</div>
                </div>
            </div>
        </div>
    )
}

export default ScoreInfo;