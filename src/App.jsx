import { memo, useEffect, useRef, useState } from 'react';
import Deck from './Deck';
import ChipStorage from './ChipStorage';

const cardSize = [96, 128];
const cardSpreadGap = 5;
const labels = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = [
    { suit: '&clubs;'  , color: 'black' },
    { suit: '&diams;'  , color: 'red'   },
    { suit: '&hearts;' , color: 'red'   },
    { suit: '&spades;' , color: 'black' },
];
const suitsMiddle = {
    A  : ['middle'],
    2  : ['top', 'bottom'],
    3  : ['top', 'middle', 'bottom'],
    4  : ['tl', 'tr', 'bl', 'br'],
    5  : ['tl', 'tr', 'middle', 'bl', 'br'],
    6  : ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
    7  : ['tl', 'tr', 'tm', 'ml', 'mr', 'bl', 'br'],
    8  : ['tl', 'tr', 'mtl', 'mtr', 'mbl', 'mbr', 'bl', 'br'],
    9  : ['tl', 'tr', 'mtl', 'mtr', 'middle', 'mbl', 'mbr', 'bl', 'br'],
    10 : ['tl', 'tr', 'mtm', 'mtl', 'mtr', 'mbl', 'mbr', 'mbm', 'bl', 'br'],
    J  : ['middle-big'],
    Q  : ['middle-big'],
    K  : ['middle-big'],
};

const cards = suits.flatMap(({ suit, color }) =>
    labels.map((label, labelIndex) => ({
        label,
        suit,
        suitsMiddle: suitsMiddle[label],
        color,
        order: labelIndex,
        forcedPosition: [],
        resetId: 0,
        defaultPosition: [
            (labelIndex % 5) * (cardSize[0] + cardSpreadGap),
            Math.floor(labelIndex / 5) * (cardSize[1] + cardSpreadGap),
        ],
        flipped: false,
    }))
);
const cardsGameSelect = [
    {
        label: 'Blackjack 21',
        suit: '&spades;',
        suitsMiddle: suitsMiddle['J'],
        color: 'black',
        order: 0,
        forcedPosition: [],
        resetId: 0,
        defaultPosition: [
            (cardSize[0] + cardSpreadGap),
            (cardSize[1] + cardSpreadGap),
        ],
        flipped: true,
    }
];

const App = () => {
    const [deckOrder, setDeckOrder] = useState([]);

    const refDecks = useRef(null);

    useEffect(() => {
        const newDeckOrder = Array.from({ length: refDecks.current.children.length }, (_, i) => i + 1);
        setDeckOrder(newDeckOrder);
    }, []);

    const updateDeckOrder = (deckIndex) => {
        const highestOrder = Math.max(...deckOrder);
        const clickedDeckOrder = deckOrder[deckIndex];

        if (clickedDeckOrder === highestOrder) return;

        setDeckOrder((prev) => {
            const newDeckOrder = [...prev].map((order) => order - 1);

            if (clickedDeckOrder !== 1) {
                const indexOne = prev.indexOf(1);
                newDeckOrder[indexOne] = clickedDeckOrder - 1;
            };

            newDeckOrder[deckIndex] = highestOrder;

            return newDeckOrder;
        });
    };

    return (
        <section>
            <section className='deck-templates'></section>
            <section ref={refDecks}
                className='decks'>
                <Deck number={0}
                    cards={cards}
                    order={deckOrder[0]}
                    updateOrder={updateDeckOrder}/>
                <Deck number={1}
                    cards={cardsGameSelect}
                    order={deckOrder[1]}
                    updateOrder={updateDeckOrder}
                    cover='game-select'/>
                <ChipStorage/>
            </section>
        </section>
    );
};

export default memo(App);