import React from 'react';
import cn from 'clsx';
import { ROUTES } from '../../../../constants';
import { ICard } from '../../GameTranslationPage';
import LinkAsButton from '../../../../components/LinkAsButton';
import Button from '../../../../components/Button';

import styles from './ScoreInfo.module.scss';

type scoreInfoProps = {
    cards: ICard[];
    onGameAgain: () => void;
}

const ScoreInfo = (props: scoreInfoProps): React.ReactElement => {
    const { cards, onGameAgain } = props;

    const numberOfRightCards = cards.length - cards.filter(c => c.userAnswer).length;

    return (
        <div className={styles.wrapper}>
            <div className={styles.window}>
                <div className={styles.leftSide}>
                    {cards.map((card: ICard) => {
                        return (
                            <div className={cn(card.isRightAnswer ? styles.true : styles.false)} key={card.word}>
                                <div>
                                    {card.word}
                                </div>
                                <div className={styles.translate}>
                                    <span>{card.translate}</span>
                                    {card?.userAnswer && 
                                        <span>
                                            Вы ответили: {card.userAnswer}
                                        </span>
                                    }
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.rightSide}>
                    <LinkAsButton text={'Назад'} to={ROUTES.HOME_PAGE} />
                    <Button onClick={onGameAgain} text={'Играть снова'}  />
                    <div>{numberOfRightCards === cards.length && <span>ВОТ ЭТО КРАСАВЧИК,</span>} Правильно: <br/>{numberOfRightCards} из {cards.length} слов</div>
                </div>
            </div>
        </div>
    )
}

export default ScoreInfo;