import { memo, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import { IoIosMove } from 'react-icons/io';
import Card from './Card';

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
const mouseDragDirections = {
    '100110011001': 'shuffle',
    '011001100110': 'shuffle',
    '110011001100': 'spread',
    '001100110011': 'spread',
};
const mouseDragLimit = 40;
const mouseDragCountLimit = 6;

const Deck = () => {
    const [mousePosition, setMousePosition] = useState([0, 0]); /// Determines click or drag
    const [deckCards, setDeckCards] = useState(cards);
    const [deckDragStartPosition, setDeckDragStartPosition] = useState([0, 0]);

    const refCards = useRef(null);
    const refCardsDragger = useRef(null);
    const refDeckPosition = useRef([0, 0]);
    const refDeckStart = useRef(null);
    const refDeckFront = useRef(null);

    const refIsMouseClick = useRef(false);  /// If deck was clicked
    const refIsDragging = useRef(false);    /// If deck is dragging
    const refIsClick = useRef(false);       /// If deck is clicked
    const refIsCardsDragging = useRef(false);
    const refIsCardsStored = useRef(true);

    const refMouseDragCoords = useRef([]);     /// Stores mouse coords in the format: [1, 1] = up, [0, 1] = right, [0, 0] = down, [1, 0] = left
    const refMouseDragCount = useRef(0);

    const handleMouseUp = (event) => {
        refDeckStart.current.style.visibility = 'hidden';
        refMouseDragCoords.current.length = 0;
        
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
        refDeckStart.current.style.visibility = 'visible';

        const deckStartRect = refDeckStart.current.getBoundingClientRect();
        const parentRect = refDeckStart.current.parentElement.getBoundingClientRect();

        const posX = (event.clientX - parentRect.left) - (deckStartRect.width / 2);
        const posY = (event.clientY - parentRect.top) - (deckStartRect.height / 2);
        refDeckStart.current.style.transform = `translate(${posX}px, ${posY}px)`;

        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;

        setMousePosition([event.clientX, event.clientY]);
        setDeckDragStartPosition([...refDeckPosition.current]);
    };

    const handleMouseMove = (event) => {
        if (!refIsMouseClick.current) return;

        const deltaX = event.clientX - mousePosition[0];
        const deltaY = event.clientY - mousePosition[1];

        if ((Math.abs(deltaX) > 5) || (Math.abs(deltaY) > 5)) {
            refIsDragging.current = true;
            refIsClick.current = false;
        };

        if (!refIsDragging.current) return;

        const posX = deckDragStartPosition[0] + deltaX;
        const posY = deckDragStartPosition[1] + deltaY;

        refDeckPosition.current = [posX, posY];
        event.currentTarget.style.transform = `translate(${posX}px, ${posY}px)`;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if ((absDeltaX > mouseDragLimit) || (absDeltaY > mouseDragLimit)) {
            const dragCoords = refMouseDragCoords.current;
            const coordsLastEntry = dragCoords[dragCoords.length - 1] || [];

            if (absDeltaX > absDeltaY) {
                if (deltaX < -mouseDragLimit) {
                    if ((coordsLastEntry[0] === 1) && (coordsLastEntry[1] === 0)) return;
                    dragCoords.push([1, 0]);
                    incrementMouseDragCount();
                } else if (deltaX > mouseDragLimit) {
                    if ((coordsLastEntry[0] === 0) && (coordsLastEntry[1] === 1)) return;
                    dragCoords.push([0, 1]);
                    incrementMouseDragCount();
                };
            } else {
                if (deltaY < -mouseDragLimit) {
                    if ((coordsLastEntry[0] === 1) && (coordsLastEntry[1] === 1)) return;
                    dragCoords.push([1, 1]);
                    incrementMouseDragCount();
                } else if (deltaY > mouseDragLimit) {
                    if ((coordsLastEntry[0] === 0) && (coordsLastEntry[1] === 0)) return;
                    dragCoords.push([0, 0]);
                    incrementMouseDragCount();
                };
            };
        };
    };

    const incrementMouseDragCount = () => {
        refMouseDragCount.current += 1;

        if (refMouseDragCount.current !== mouseDragCountLimit) return;
        refMouseDragCount.current = 0;
    
        const directionCode = refMouseDragCoords.current.flat().join('');
        const direction = mouseDragDirections[directionCode];
        refMouseDragCoords.current.length = 0;

        handleDragDirection(direction);
    };

    const handleDragDirection = (direction) => {
        switch (direction) {
            case 'shuffle':
                shuffleDeck();
                playDragAnimation();
                break;
            case 'spread':
                spreadDeck();
                playDragAnimation();
                break;
            default: break;
        };
    };

    const playDragAnimation = () => {
        refDeckFront.current.style.animation = '';
        window.requestAnimationFrame(() => {
            refDeckFront.current.style.animation = '0.8s deckConfirmedMotion 2 alternate'; 
        });
    };

    const shuffleDeck = () => {
        setDeckCards((prev) => {
            const shuffled = [...prev];
            let currentIndex = shuffled.length;

            while (currentIndex !== 0) {
                let randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
            };

            return shuffled.map((card, index) => ({
                ...card,
                order: index,
            }));
        });
    };

    const spreadDeck = () => {
        setDeckCards((cards) =>
            cards.map((card) => {
                return {
                    ...card,
                    forcedPosition: card.defaultPosition,
                    resetId: card.resetId + 1,
                }
            })
        );
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

    const bringCardToFront = (clickedIndex) => {
        setDeckCards((prev) => {
            const highestOrder = Math.max(...prev.map((card) => card.order));

            return prev.map((card, index) =>
                (index === clickedIndex)
                    ? { ...card, order: highestOrder + 1 }
                    : card
            );
        });
    };

    return (
        <section className='deck'>
            <div ref={refDeckStart}
                className='deck-start'>
                <IconContext.Provider value={{ size: '4rem', color: '#ffadad', className: 'global-class-name' }}>
                    <IoIosMove/>
                </IconContext.Provider>
            </div>
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
                {deckCards.map((c, cn) => {
                    return <Card label={c.label}
                        suit={c.suit}
                        suitsMiddle={c.suitsMiddle}
                        color={c.color}
                        order={c.order}
                        onBringCardToFront={() => bringCardToFront(cn)}
                        forcedPosition={c.forcedPosition}
                        resetId={c.resetId}
                        key={`deck 1 card ${cn}`}/>
                })}
            </div>
        </section>
    );
};

export default memo(Deck);