import { memo, useEffect, useRef, useState } from 'react';
import Game from './Game';

const Card = ({ label, name, suit, suitsMiddle, color, order, onBringCardToFront, forcedPosition, resetId, flipped, interactive, moveDeck }) => {
    const [cardName, setCardName] = useState(name);
    const [isRotated, setIsRotated] = useState(false);
    const [isActive, setIsAcitve] = useState(false);

    const refCard = useRef(null);
    const refCardInner = useRef(null);

    const refMousePosition = useRef([0, 0]); /// Determines click or drag
    const refCardDragStartPosition = useRef([0, 0]);
    const refCardPosition = useRef([0, 0]);

    const refIsMouseClick = useRef(false);  /// If card was clicked
    const refIsDragging = useRef(false);    /// If card is dragging
    const refIsClick = useRef(false);       /// If card is clicked

    useEffect(() => {
        if (forcedPosition.length === 0) return;

        refCardPosition.current = forcedPosition;
        refCard.current.style.transform = `translate(${forcedPosition[0]}px, ${forcedPosition[1]}px)`;
    }, [resetId]);
    
    const handleMouseDown = (event) => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);

        onBringCardToFront();

        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;

        refMousePosition.current = [event.clientX, event.clientY];
        refCardDragStartPosition.current = [...refCardPosition.current];
    };

    const handleMouseUp = (event) => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);

        refIsMouseClick.current = false;
        refIsDragging.current = false;

        if (refIsClick.current) handleCardClick(event);
    };

    const handleCardClick = () => {
        setIsAcitve(!isActive);

        refIsClick.current = false;
        refCardInner.current.classList.toggle('card-flipped');

        if (!interactive) return;

        setIsRotated(!isRotated);
    };

    const handleMouseMove = (event) => {
        if (!refIsMouseClick.current) return;

        const deltaX = event.clientX - refMousePosition.current[0];
        const deltaY = event.clientY - refMousePosition.current[1];

        if ((Math.abs(deltaX) > 5) || (Math.abs(deltaY) > 5)) {
            refIsDragging.current = true;
            refIsClick.current = false;
        };

        if (!refIsDragging.current) return;

        const posX = refCardDragStartPosition.current[0] + deltaX;
        const posY = refCardDragStartPosition.current[1] + deltaY;

        refCardPosition.current = [posX, posY];
        refCard.current.style.transform = `translate(${posX}px, ${posY}px)`;
    };

    return (
        <section ref={refCard}
            className='card-container'
            style={{ zIndex: order }}>
            {(isActive) && (cardName === 'blackjack21')
                && <Game moveDeck={moveDeck}/>}
            <div ref={refCardInner}
                className={`card-container-inner ${(flipped) ? 'card-flipped' : ''}`}
                onMouseDown={handleMouseDown}>
                <div className={`card front ${color} ${(isRotated) ? 'active' : ''}`}>
                    <div className='card-label left'>
                        <span>{label}</span>
                        <span dangerouslySetInnerHTML={{ __html: suit }}></span>
                    </div>
                    <div className='card-center'>
                        {suitsMiddle.map((suitNum) => {
                            return <span dangerouslySetInnerHTML={{ __html: suit }}
                                className={suitNum}
                                key={`${label} suit ${suitNum}`}></span>
                        })}
                    </div>
                    <div className='card-label right'>
                        <span>{label}</span>
                        <span dangerouslySetInnerHTML={{ __html: suit }}></span>
                    </div>
                </div>
                <div className={`card back ${color} ${(isRotated) ? 'active' : ''}`}></div>
            </div>
        </section>
    );
};

export default memo(Card);