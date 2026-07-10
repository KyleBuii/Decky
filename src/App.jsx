import { memo } from 'react';
import Deck from './Deck';

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
    }))
);
const cardsGameSelect = [
    {
        label: 'Blackjack 21',
        suit: '&clubs;',
        suitsMiddle: suitsMiddle['J'],
        color: 'black',
        order: 0,
        forcedPosition: [],
        resetId: 0,
        defaultPosition: [
            (cardSize[0] + cardSpreadGap),
            (cardSize[1] + cardSpreadGap),
        ],
    }
];

const App = () => {
    return (
        <section>
            <section className='deck-templates'></section>
            <section className='decks'>
                <Deck cards={cards}/>
                <Deck cover='game-select'/>
            </section>
        </section>
    );
};

export default memo(App);