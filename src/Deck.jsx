import { memo, useRef, useState } from 'react';
import Card from './Card';

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
    labels.map((label) => ({
        label,
        suit,
        suitsMiddle: suitsMiddle[label],
        color,
    }))
);

const Deck = () => {
    const [mousePosition, setMousePosition] = useState([0, 0]); /// Determines click or drag
    const [deckDragStartPosition, setDeckDragStartPosition] = useState([0, 0]);
    const [deckPosition, setDeckPosition] = useState([0, 0]);

    const refIsMouseClick = useRef(false);  /// If deck was clicked
    const refIsDragging = useRef(false);    /// If deck is dragging
    const refIsClick = useRef(false);       /// If deck is clicked
    const refCards = useRef(null);
    const refCardsDragger = useRef(null);
    const refDeckFront = useRef(null);
    const refIsCardsDragging = useRef(false);
    const refIsCardsStored = useRef(true);

    const handleMouseUp = (event) => {
        refIsMouseClick.current = false;
        refIsDragging.current = false;
        if (refIsClick.current) handleClickDeckFront(event);
    };

    const handleClickDeckFront = (event) => {
        if (refIsCardsStored.current) {
            setCardsLocation(event.clientX, event.clientY);

            refCards.current.style.visibility = 'visible';
            refCardsDragger.current.style.visibility = 'visible';
            refDeckFront.current.style.zIndex = 0;

            refIsCardsDragging.current = true;
            refIsCardsStored.current = false;
        } else {
            refCards.current.style.visibility = 'hidden';
            refIsCardsStored.current = true;
        };
    };

    const handleMouseDown = (event) => {
        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;

        setMousePosition([event.clientX, event.clientY]);
        setDeckDragStartPosition([...deckPosition]);
    };

    const handleMouseMove = (event) => {
        const deltaX = event.clientX - mousePosition[0];
        const deltaY = event.clientY - mousePosition[1];

        if (refIsMouseClick.current && ((Math.abs(deltaX) > 5) || (Math.abs(deltaY) > 5))) {
            refIsDragging.current = true;
            refIsClick.current = false;
        };

        if (!refIsDragging.current) return;

        const posX = deckDragStartPosition[0] + deltaX;
        const posY = deckDragStartPosition[1] + deltaY;

        setDeckPosition([posX, posY]);
        event.currentTarget.style.transform = `translate(${posX}px, ${posY}px)`;
    };
    
    const handleMouseClickCards = () => {
        refIsCardsDragging.current = false;
        refDeckFront.current.style.zIndex = 999;
        refCardsDragger.current.style.visibility = 'hidden';
    };

    const handleMouseMoveCards = (event) => {
        if (!refIsCardsDragging.current) return;
        setCardsLocation(event.clientX, event.clientY);
    };

    const setCardsLocation = (x, y) => {
        const cardRect = refCardsDragger.current.getBoundingClientRect();
        const cardWidth = cardRect.width;
        const cardHeight = cardRect.height;
        const posX = x - (cardWidth / 2);
        const posY = y - (cardHeight / 2);
        refCards.current.style.transform = `translate(${posX}px, ${posY}px)`;
    };

    return (
        <section className='deck'>
            <div ref={refDeckFront}
                className='deck-front'
                onMouseUp={handleMouseUp}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}></div>
            <div ref={refCards}
                className='cards'>
                <div ref={refCardsDragger}
                    className='cards-dragger'
                    onClick={handleMouseClickCards}
                    onMouseMove={handleMouseMoveCards}>
                </div>
                {cards.map((c, cn) => {
                    return <Card label={c.label}
                        suit={c.suit}
                        suitsMiddle={c.suitsMiddle}
                        color={c.color}
                        order={cn}
                        key={`deck 1 card ${cn}`}/>
                })}
            </div>
        </section>
    );
};

export default memo(Deck);