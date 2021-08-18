import React from 'react';

import Card from '../../../../components/Card';
import { sizeVariant } from '../../../../components/Card/Card';
import DynamicPagination from '../../../../components/DynamicPagination';
import { words, card } from '../../DictionaryPage';

import styles from './UserCards.module.scss';

type UserCardsProps = {
    page: number,
    maxPage: number,
    cards: {word: string, translations: string[], imageURL: string, counter: number}[],
    selectedWords: words,
    onScrollPage: () => Promise<string | void>,
}

const UserCards = (props: UserCardsProps): React.ReactElement => {
    const { page, maxPage, cards, selectedWords, onScrollPage } = props;
    
    const cardsElem = (cards: card[]) => {
        if (selectedWords === words.known) {
            cards = cards.filter(c => c.counter > 7)
        } else if (selectedWords === words.unknown) {
            cards = cards.filter(c => c.counter < 7)
        }

        return cards.map(card =>
            <div className={styles.card} key={card.word}>
              <Card
                    word={card.word}
                    translate={card.translations[0]} 
                    url={card.imageURL}
                    size={sizeVariant.s}
                  />
            </div>
        )
    }

    return (
      <div className={styles.cardsWrapper}>
        <DynamicPagination currentPage={page} maxPage={maxPage} onScrollEnd={onScrollPage}>
          {cards.map(card =>
            <div className={styles.card} key={card.word}>
              <Card
                    word={card.word}
                    translate={card.translations[0]} 
                    url={card.imageURL}
                    size={sizeVariant.s}
                  />
            </div>
          )}
        </DynamicPagination>
      </div>
    )
}

export default UserCards;