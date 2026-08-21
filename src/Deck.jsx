import { memo, useRef, useState } from 'react';
import { IconContext } from 'react-icons';
import { IoIosMove } from 'react-icons/io';
import Card from './Card';

/// [1, 1, 1] = up
/// [0, 1, 1] = up right
/// [1, 1, 0] = up left
/// [0, 0, 1] = right
/// [0, 0, 0] = down
/// [0, 1, 0] = down right
/// [1, 0, 1] = down left
/// [1, 0, 0] = left
const mouseDragDirections = {
    '100001100001100001': 'shuffle',  /// left       -> right
    '001100001100001100': 'shuffle',  /// right      -> left
    '111000111000111000': 'spread',   /// up         -> down
    '000111000111000111': 'spread',   /// down       -> up
    '011101011101011101': 'collapse', /// up right   -> down left
    '101011101011101011': 'collapse', /// down left  -> up right
};
const MOUSE_DRAG_LIMIT = 40;
const DIRECTION_DRAG_LIMIT = 20;
const MOUSE_DRAG_COUNT_LIMIT = 6;

const Deck = ({ number, cards, order, isGuidelines, updateOrder, updateDragged, updateGame = null, cover = '' }) => {
    const [deckCards, setDeckCards] = useState(cards);

    const refDeck = useRef(null);
    const refCards = useRef(null);
    const refCardsDragger = useRef(null);
    const refDeckStart = useRef(null);
    const refDeckFront = useRef(null);

    const refMousePosition = useRef([0, 0]);
    const refDeckDragStartPosition = useRef([0, 0]);
    const refDeckPosition = useRef([0, 0]);

    const refIsMouseClick = useRef(false);  /// If deck was clicked
    const refIsDragging = useRef(false);    /// If deck is dragging
    const refIsClick = useRef(false);       /// If deck is clicked
    const refIsCardsDragging = useRef(false);
    const refIsCardsStored = useRef(true);

    const refMouseDragCoords = useRef([]); /// Stores mouse coords in the format: [1, 1] = up, [0, 1] = right, [0, 0] = down, [1, 0] = left
    const refMouseDragCount = useRef(0);

    const handleMouseDown = (event) => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        refDeckFront.current.style.cursor = 'grabbing';
        refDeckStart.current.style.visibility = 'visible';

        const deckStartRect = refDeckStart.current.getBoundingClientRect();
        const parentRect = refDeckStart.current.parentElement.getBoundingClientRect();

        const posX = (event.clientX - parentRect.left) - (deckStartRect.width / 2);
        const posY = (event.clientY - parentRect.top) - (deckStartRect.height / 2);
        refDeckStart.current.style.transform = `translate(${posX}px, ${posY}px)`;

        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;

        refMousePosition.current = [event.clientX, event.clientY];
        refDeckDragStartPosition.current = [...refDeckPosition.current];

        updateOrder(number);
    };

    const handleMouseUp = (event) => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);

        refDeckFront.current.style.cursor = 'grab';
        refDeckStart.current.style.visibility = 'hidden';

        refMouseDragCount.current = 0;
        refMouseDragCoords.current.length = 0;
        
        refIsMouseClick.current = false;
        refIsDragging.current = false;

        if (refIsClick.current) handleClickDeckFront(event);
    };

    const handleClickDeckFront = (event) => {
        if (refIsCardsStored.current) {
            const deckRect = refDeck.current.getBoundingClientRect();
            setCardsLocation(event.clientX - deckRect.left, event.clientY - deckRect.top);

            refCards.current.style.visibility = 'visible';
            refCardsDragger.current.style.visibility = 'visible';
            refDeckFront.current.style.zIndex = 0;

            refIsCardsDragging.current = true;
            refIsCardsStored.current = false;

            updateDragged(refCards.current);
        } else {
            refCards.current.style.visibility = 'hidden';
            refIsCardsStored.current = true;
        };
    };

    const handleMouseMove = (event) => {
        if (!refIsMouseClick.current) return;
        
        const deltaX = event.clientX - refMousePosition.current[0];
        const deltaY = event.clientY - refMousePosition.current[1];
        
        if (refIsClick.current && ((Math.abs(deltaX) > 5) || (Math.abs(deltaY) > 5))) {
            refIsDragging.current = true;
            refIsClick.current = false;
        };
        
        if (!refIsDragging.current) return;
        
        const posX = refDeckDragStartPosition.current[0] + deltaX;
        const posY = refDeckDragStartPosition.current[1] + deltaY;

        refDeckPosition.current = [posX, posY];
        refDeckFront.current.style.transform = `translate(${posX}px, ${posY}px)`;

        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);

        if ((absDeltaX > MOUSE_DRAG_LIMIT) || (absDeltaY > MOUSE_DRAG_LIMIT)) {
            const dragCoords = refMouseDragCoords.current;
            const coordsLastEntry = dragCoords[dragCoords.length - 1] || [];

            if ((deltaY < -MOUSE_DRAG_LIMIT) && (absDeltaX < DIRECTION_DRAG_LIMIT)) {
                /// Up [_, -y]
                /// [x < DIR_LIMIT && x > -DIR_LIMIT || abs(x) < DIR_LIMIT, y < -MOUSE_LIMIT]
                if ((coordsLastEntry[0] === 1) && (coordsLastEntry[1] === 1) && (coordsLastEntry[2] === 1)) return;
                dragCoords.push([1, 1, 1]);
                incrementMouseDragCount();
            } else if ((deltaX > MOUSE_DRAG_LIMIT) && (deltaY < -(DIRECTION_DRAG_LIMIT * 2))) {
                /// Up Right [x, -y]
                /// [x > MOUSE_LIMIT, y < -(DIR_LIMIT * 2)]
                if ((coordsLastEntry[0] === 0) && (coordsLastEntry[1] === 1) && (coordsLastEntry[2] === 1)) return;
                dragCoords.push([0, 1, 1]);
                incrementMouseDragCount();
            } else if ((deltaX < -MOUSE_DRAG_LIMIT) && (deltaY < -(DIRECTION_DRAG_LIMIT * 2))) {
                /// Up Left [-x, -y]
                /// [x < -MOUSE_LIMIT, y < -(DIR_LIMIT * 2)]
                if ((coordsLastEntry[0] === 1) && (coordsLastEntry[1] === 1) && (coordsLastEntry[2] === 0)) return;
                dragCoords.push([1, 1, 0]);
                incrementMouseDragCount();
            } else if ((deltaX > MOUSE_DRAG_LIMIT) && (absDeltaY < DIRECTION_DRAG_LIMIT)) {
                /// Right [x, _]
                /// [x > MOUSE_LIMIT, y < DIR_LIMIT && y > -DIR_LIMIT || abs(y) < DIR_LIMIT]
                if ((coordsLastEntry[0] === 0) && (coordsLastEntry[1] === 0) && (coordsLastEntry[2] === 1)) return;
                dragCoords.push([0, 0, 1]);
                incrementMouseDragCount();
            } else if ((deltaY > MOUSE_DRAG_LIMIT) && (absDeltaX < DIRECTION_DRAG_LIMIT)) {
                /// Down [_, y]
                /// [x < DIR_LIMIT && x > -DIR_LIMIT || abs(x) < DIR_LIMIT, y > MOUSE_LIMIT]
                if ((coordsLastEntry[0] === 0) && (coordsLastEntry[1] === 0) && (coordsLastEntry[2] === 0)) return;
                dragCoords.push([0, 0, 0]);
                incrementMouseDragCount();
            } else if ((deltaX > MOUSE_DRAG_LIMIT) && (deltaY > (DIRECTION_DRAG_LIMIT * 2))) {
                /// Down Right [x, y]
                /// [x > MOUSE_LIMIT, y > (DIR_LIMIT * 2)]
                if ((coordsLastEntry[0] === 0) && (coordsLastEntry[1] === 1) && (coordsLastEntry[2] === 0)) return;
                dragCoords.push([0, 1, 0]);
                incrementMouseDragCount();
            } else if ((deltaX < -MOUSE_DRAG_LIMIT) && (deltaY > (DIRECTION_DRAG_LIMIT * 2))) {
                /// Down Left [-x, y]
                /// [x < -MOUSE_LIMIT, y > (DIR_LIMIT * 2)]
                if ((coordsLastEntry[0] === 1) && (coordsLastEntry[1] === 0) && (coordsLastEntry[2] === 1)) return;
                dragCoords.push([1, 0, 1]);
                incrementMouseDragCount();
            } else if ((deltaX < -MOUSE_DRAG_LIMIT) && (absDeltaY < DIRECTION_DRAG_LIMIT)) {
                /// Left [-x, _]
                /// [x < -MOUSE_LIMIT, y < DIR_LIMIT && y > -DIR_LIMIT || abs(y) < DIR_LIMIT]
                if ((coordsLastEntry[0] === 1) && (coordsLastEntry[1] === 0) && (coordsLastEntry[2] === 0)) return;
                dragCoords.push([1, 0, 0]);
                incrementMouseDragCount();
            };
        };
    };

    const incrementMouseDragCount = () => {
        refMouseDragCount.current += 1;

        if (refMouseDragCount.current !== MOUSE_DRAG_COUNT_LIMIT) return;
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
            case 'collapse':
                collapseDeck();
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

    const collapseDeck = () => {
        setDeckCards((cards) =>
            cards.map((card) => {
                return {
                    ...card,
                    forcedPosition: [0, 0],
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
        const deckRect = refDeck.current.getBoundingClientRect();
        setCardsLocation(event.clientX - deckRect.left, event.clientY - deckRect.top);
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
        <section ref={refDeck}
            className='deck'
            style={{ zIndex: order }}>
            <div ref={refDeckStart}
                className='deck-start'>
                <IconContext.Provider value={{ size: '4rem', color: '#ffadad', style: { margin: '2.5rem' }, className: 'global-class-name' }}>
                    <IoIosMove/>
                </IconContext.Provider>
                {(isGuidelines)
                    && <div>
                        <div className='drag-area up'></div>
                        <div className='drag-area up-right'></div>
                        <div className='drag-area up-left'></div>
                        <div className='drag-area right'></div>
                        <div className='drag-area down'></div>
                        <div className='drag-area down-right'></div>
                        <div className='drag-area down-left'></div>
                        <div className='drag-area left'></div>
                    </div>}
            </div>
            <div ref={refDeckFront}
                style={{ backgroundImage: `url(/assets/deck-${cover ? `${cover}-` : ''}front.webp)` }}
                className='deck-front'
                onMouseDown={handleMouseDown}></div>
            <div ref={refCards}
                className='cards'>
                <div ref={refCardsDragger}
                    className='cards-dragger'
                    onClick={handleMouseClickCards}
                    onMouseMove={handleMouseMoveCards}>
                </div>
                {deckCards?.map((c, cn) => {
                    return <Card label={c.label}
                        name={c?.name}
                        suit={c.suit}
                        suitsMiddle={c.suitsMiddle}
                        color={c.color}
                        order={c.order}
                        onBringCardToFront={() => bringCardToFront(cn)}
                        forcedPosition={c.forcedPosition}
                        resetId={c.resetId}
                        flipped={c?.flipped}
                        interactive={c?.interactive}
                        {...(c.interactive) ? { updateGame: updateGame } : {}}
                        key={`deck 1 card ${cn}`}/>
                })}
            </div>
        </section>
    );
};

export default memo(Deck);