import { memo, useEffect, useRef, useState } from 'react';

const Card = ({ label, name, suit, suitsMiddle, color, order, onBringCardToFront, forcedPosition, resetId, flipped, interactive, updateCurrentCard, updateGame = null, art = '' }) => {
    const [isRotated, setIsRotated] = useState(false);

    const refCard = useRef(null);

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

        refCard.current.style.cursor = 'grabbing';

        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;

        refMousePosition.current = [event.clientX, event.clientY];
        refCardDragStartPosition.current = [...refCardPosition.current];
    };

    const handleMouseUp = (event) => {
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('mousemove', handleMouseMove);

        refCard.current.style.cursor = 'grab';

        refIsMouseClick.current = false;
        refIsDragging.current = false;

        if (refIsClick.current) handleCardClick(event);
    };

    const handleCardClick = () => {
        refIsClick.current = false;

        const cardInner = refCard.current.firstChild;
        cardInner.classList.toggle('card-flipped');

        if (!interactive) return;

        updateCurrentCard(refCard.current);
        updateGame(name);
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
            style={{ zIndex: order }}
            onMouseDown={handleMouseDown}>
            <div className={`card-container-inner ${flipped ? 'card-flipped' : ''}`}>
                <div className={`card front ${color} ${(isRotated) ? 'active' : ''} ${(art === '') ? '' : art}`}>
                    <div className='card-label left'>
                        <span>{label}</span>
                        <span dangerouslySetInnerHTML={{ __html: suit }}></span>
                    </div>
                    <div className='card-center'>
                        {(art === '')
                            ? suitsMiddle.map((suitNum) => {
                                return <span dangerouslySetInnerHTML={{ __html: suit }}
                                    className={suitNum}
                                    key={`${label} suit ${suitNum} ${art}`}></span>
                            })
                            : <></>
                        }
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