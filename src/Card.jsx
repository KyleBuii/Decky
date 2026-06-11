import { memo, useRef, useState } from 'react';

const Card = ({ label, suit, suitsMiddle, color, order, art = '' }) => {
    const [mousePosition, setMousePosition] = useState([0, 0]); /// Determines click or drag
    const [cardDragStartPosition, setCardDragStartPosition] = useState([0, 0]);
    const [cardPosition, setCardPosition] = useState([0, 0]);

    const refIsMouseClick = useRef(false);  /// If card was clicked
    const refIsDragging = useRef(false);    /// If card is dragging
    const refIsClick = useRef(false);       /// If card is clicked

    const handleCardClick = (event) => {
        refIsClick.current = false;

        const cardInner = event.currentTarget.firstChild;
        if (cardInner.style.transform === 'unset') {
            event.currentTarget.firstChild.style.transform = 'rotateY(180deg)';
        } else {
            event.currentTarget.firstChild.style.transform = 'unset';
        };
    };
    
    const handleMouseUp = (event) => {
        refIsMouseClick.current = false;
        refIsDragging.current = false;
        if (refIsClick.current) handleCardClick(event);
    };

    const handleMouseDown = (event) => {
        refIsMouseClick.current = true;
        refIsDragging.current = false;
        refIsClick.current = true;

        setMousePosition([event.clientX, event.clientY]);
        setCardDragStartPosition([...cardPosition]);
    };

    const handleMouseMove = (event) => {
        const deltaX = event.clientX - mousePosition[0];
        const deltaY = event.clientY - mousePosition[1];

        if (refIsMouseClick.current && ((Math.abs(deltaX) > 5) || (Math.abs(deltaY) > 5))) {
            refIsDragging.current = true;
            refIsClick.current = false;
        };

        if (!refIsDragging.current) return;

        const posX = cardDragStartPosition[0] + deltaX;
        const posY = cardDragStartPosition[1] + deltaY;

        setCardPosition([posX, posY]);
        event.currentTarget.style.transform = `translate(${posX}px, ${posY}px)`;
    };

    return (
        <section className='card-container'
            style={{ zIndex: order }}
            onMouseUp={handleMouseUp}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}>
            <div className='card-container-inner'>
                <div className={`card front ${color} ${art === '' ? '' : art}`}>
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
                <div className={`card back ${color}`}></div>
            </div>
        </section>
    );
};

export default memo(Card);